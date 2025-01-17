const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { authGuard } = require("./auth.middleware");
const { findUserByEmail } = require("../models/users/users.model");
const BaseResponse = require("../base/BaseResponse");
const StatusCodes = require("../constants/StatusCodes");
const {translate} = require("../config/i18n");


// Mock dependencies
jest.mock("../models/users/users.model");
jest.mock("jsonwebtoken");

const app = express();

// Sample route for testing
app.use(express.json());
app.get("/protected", authGuard(["admin"]), (req, res) => {
    res.status(200).json(BaseResponse.success({ message: "Access granted!" }));
});

// Helper to generate a valid JWT token
const generateToken = (email, role) => {
    return jwt.sign({ email, role }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

describe("authGuard Middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if no token is provided", async () => {
        const response = await request(app).get("/protected");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(translate("unauthorized"));
    });

    it("should return 401 if token is invalid", async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        const response = await request(app)
            .get("/protected")
            .set("Authorization", "Bearer invalid_token");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(translate("user.auth.failed"));
    });

    it("should return 401 if user not found", async () => {
        const validToken = generateToken("test@example.com", "admin");
        jwt.verify.mockReturnValue({ email: "test@example.com" });
        findUserByEmail.mockResolvedValue(null); // User not found

        const response = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${validToken}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(translate("user.not.found"));
    });

    it("should return 401 if user is inactive", async () => {
        const validToken = generateToken("test@example.com", "admin");
        jwt.verify.mockReturnValue({ email: "test@example.com" });
        findUserByEmail.mockResolvedValue({ active: false }); // Inactive user

        const response = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${validToken}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(translate("user.not.found"));
    });

    it("should return 403 if user role does not match", async () => {
        const validToken = generateToken("test@example.com", "user");
        jwt.verify.mockReturnValue({ email: "test@example.com" });
        findUserByEmail.mockResolvedValue({ role: "user", active: true });

        const response = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${validToken}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(translate("resource.forbidden"));
    });

    it("should allow access if user is authorized", async () => {
        const validToken = generateToken("admin@example.com", "admin");
        jwt.verify.mockReturnValue({ email: "admin@example.com" });
        findUserByEmail.mockResolvedValue({ role: "admin", active: true });

        const response = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
    });
});
