const request = require("supertest");
const express = require("express");
const requestIp = require('request-ip');
const { redisClient } = require("../config/redisClient");
const rateLimiter = require("./rateLimiter.middleware");
const BaseResponse = require("../base/BaseResponse");
const StatusCodes = require("../constants/StatusCodes");
const {translate} = require("../config/i18n");

jest.mock('request-ip');
jest.mock("../config/redisClient");

const app = express();
app.use(rateLimiter);
app.get("/test", (req, res) => {
    res.status(200).json(BaseResponse.success({ message: "Request successful" }));
});

describe("rateLimiter Middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("allows request if under rate limit", async () => {
        requestIp.getClientIp.mockReturnValue("127.0.0.1");
        redisClient.get.mockResolvedValue(null);
        redisClient.multi.mockReturnValue({
            incr: jest.fn().mockReturnThis(),
            expire: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([null, null])
        });

        const response = await request(app).get("/test");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
    });

    it("returns 429 if rate limit is exceeded", async () => {
        requestIp.getClientIp.mockReturnValue("127.0.0.1");
        redisClient.get.mockResolvedValue("100");

        const response = await request(app).get("/test");
        expect(response.status).toBe(429);
        expect(response.body.message).toBe(translate("rate.limit.exceeded"));
    });

    it("returns 500 if there is an error during rate limiting", async () => {
        requestIp.getClientIp.mockReturnValue("127.0.0.1");
        redisClient.get.mockRejectedValue(new Error("Redis error"));

        const response = await request(app).get("/test");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(translate("internal.server.error"));
    });

    it("increments request count if under rate limit", async () => {
        requestIp.getClientIp.mockReturnValue("127.0.0.1");
        redisClient.get.mockResolvedValue("50");
        const multiMock = {
            incr: jest.fn().mockReturnThis(),
            expire: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([null, null])
        };
        redisClient.multi.mockReturnValue(multiMock);

        await request(app).get("/test");
        expect(multiMock.incr).toHaveBeenCalledWith("rate_limit:127.0.0.1");
        expect(multiMock.expire).toHaveBeenCalledWith("rate_limit:127.0.0.1", 3600);
    });
});