const {findUserByEmail, saveUser, existsUserWithEmail} = require("../../models/users/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BaseResponse = require("../../base/BaseResponse");
const InvalidCredentialsError = require("../../exceptions/InvalidCredentialsError");
const {redisClient} = require("../../config/redisClient");
const StatusCodes = require("../../constants/StatusCodes");

/**
 * Handles user sign-in.
 * 1. Checks if the user exists by email.
 * 2. Compares the provided password with the stored hash.
 * 3. Generates a JWT token for the authenticated user.
 *
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object to send the result or error message.
 */
const signIn = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await findUserByEmail(email);
    if (!existingUser || !existingUser.active) {
        throw new InvalidCredentialsError("invalid.credentials");
    }

    if (existingUser.lockLogin && new Date() < existingUser.lockLogin) {
        return res.status(403).json(BaseResponse.error(StatusCodes.FORBIDDEN, "multiple.invalid.attempts"));
    }

    const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
    if (!isCorrectPassword) {
        existingUser.invalidLoginAttempts = (existingUser.invalidLoginAttempts || 0) + 1;
        if (existingUser.invalidLoginAttempts >= 5) {
            existingUser.lockLogin = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        }
        await existingUser.save();
        throw new InvalidCredentialsError("invalid.credentials");
    }

    existingUser.invalidLoginAttempts = 0;
    existingUser.lockLogin = null;
    await existingUser.save();

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = await generateRefreshToken(existingUser);

    res.status(200).json(BaseResponse.success({result: existingUser, accessToken, refreshToken}));
};

/**
 * Handles user sign-up.
 * 1. Checks if the user already exists by email using model method.
 * 2. Verifies password confirmation.
 * 3. Hashes the password and creates a new user record using the model method.
 * 4. Generates a JWT token for the new user.
 *
 * @param {Object} req - The request object containing user sign-up data.
 * @param {Object} res - The response object to send the result or error message.
 */
const signUp = async (req, res) => {
    const {email, password, firstName, lastName, role} = req.body;

    const userExists = await existsUserWithEmail(email);
    if (userExists) {
        return res.status(409).json(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, "user.email.exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
        name: `${firstName} ${lastName}`, password: hashedPassword, email, role: role || "Student",
    };

    const result = await saveUser(user);

    const accessToken = generateAccessToken(result);
    const refreshToken = await generateRefreshToken(result);

    res.status(201).json(BaseResponse.success({result, accessToken, refreshToken}));
};

/**
 * Generates JWT tokens.
 */
const generateAccessToken = (user) => {
    return jwt.sign({id: user._id, email: user.email, role: user.role}, process.env.SECRET_KEY, {
        expiresIn: "15m", // Short-lived access token
    });
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // Longer-lived refresh token
    });

    await redisClient.set(`refresh_token:${user._id}`, refreshToken, {
        EX: 7 * 24 * 60 * 60, // Expire after 7 days
    });

    return refreshToken;
};


/**
 * Handles token refresh.
 * 1. Verifies the refresh token.
 *  2. Checks if the token is stored in Redis.
 *  3. Finds the user by email.
 *  4. Generates new access and refresh tokens.
 *  5. Sends the new tokens in the response.
 *  @return {Object} - The response object to send the result or error message.
 */
const refreshToken = async (req, res) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
        return res.status(400).json(BaseResponse.error(StatusCodes.BAD_REQUEST, "refresh.token.required"));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redisClient.get(`refresh_token:${decoded.id}`);

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json(BaseResponse.error(StatusCodes.UNAUTHORIZED, "refresh.token.expired"));
        }

        const user = await findUserByEmail(decoded.email);
        if (!user) {
            return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "user.not.found"));
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user);

        res.status(200).json(BaseResponse.success({accessToken: newAccessToken, refreshToken: newRefreshToken}));
    } catch (error) {
        res.status(401).json(BaseResponse.error(StatusCodes.UNAUTHORIZED, "refresh.token.expired"));
    }
};

module.exports = {signIn, signUp, refreshToken};
