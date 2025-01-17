const { signIn, signUp, refreshToken } = require('../../routes/auth/auth.controller');
const { findUserByEmail, saveUser, existsUserWithEmail } = require('../../models/users/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseResponse = require('../../base/BaseResponse');
const InvalidCredentialsError = require('../../exceptions/InvalidCredentialsError');
const { redisClient } = require('../../config/redisClient');
const StatusCodes = require('../../constants/StatusCodes');

jest.mock('../../models/users/users.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../config/redisClient');

describe('Auth Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('signIn', () => {
        it('should sign in the user successfully with valid credentials', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                password: 'hashedPassword',
                active: true,
                invalidLoginAttempts: 0,
                lockLogin: null
            };
            findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockAccessToken');
            redisClient.set.mockResolvedValue('mockRefreshToken');

            req.body = { email: 'test@example.com', password: 'password' };

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({
                result: mockUser,
                accessToken: 'mockAccessToken',
                refreshToken: 'mockAccessToken'
            }));
        });

        it('should throw InvalidCredentialsError for incorrect password', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                password: 'hashedPassword',
                active: true,
                invalidLoginAttempts: 0,
                lockLogin: null
            };
            findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            req.body = { email: 'test@example.com', password: 'wrongPassword' };

            await expect(signIn(req, res)).rejects.toThrow(InvalidCredentialsError);
        });

        it('should lock the user account after 5 invalid login attempts', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                password: 'hashedPassword',
                active: true,
                invalidLoginAttempts: 4,
                lockLogin: null
            };
            findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            saveUser.mockResolvedValue(mockUser);

            req.body = { email: 'test@example.com', password: 'wrongPassword' };

            await signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.FORBIDDEN, "multiple.invalid.attempts"));
        });
    });

    describe('signUp', () => {
        it('should sign up a new user successfully', async () => {
            const mockUser = {
                _id: '1',
                email: 'test@example.com',
                name: 'Test User',
                role: 'Student',
                password: 'hashedPassword'
            };
            existsUserWithEmail.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            saveUser.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mockAccessToken');
            redisClient.set.mockResolvedValue('mockRefreshToken');

            req.body = { email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User' };

            await signUp(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({
                result: mockUser,
                accessToken: 'mockAccessToken',
                refreshToken: 'mockAccessToken'
            }));
        });

        it('should return error if user already exists', async () => {
            existsUserWithEmail.mockResolvedValue(true);

            req.body = { email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User' };

            await signUp(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, "user.email.exists"));
        });
    });

    describe('refreshToken', () => {
        it('should return a new access and refresh token when refresh token is valid', async () => {
            const mockUser = { _id: '1', email: 'test@example.com', role: 'Student' };
            const mockRefreshToken = 'validRefreshToken';
            jwt.verify.mockReturnValue({ id: '1', email: 'test@example.com' });
            redisClient.get.mockResolvedValue(mockRefreshToken);
            jwt.sign.mockReturnValue(mockUser);
            redisClient.set.mockResolvedValue(mockRefreshToken);

            req.body = { refreshToken: mockRefreshToken };

            await refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({
                accessToken: 'mockNewAccessToken',
                refreshToken: 'mockNewRefreshToken'
            }));
        });

        it('should return error if refresh token is missing', async () => {
            req.body = {};

            await refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.BAD_REQUEST, "refresh.token.required"));
        });

        it('should return error if refresh token is invalid or expired', async () => {
            const mockUser = { _id: '1', email: 'test@example.com', role: 'Student' };
            const invalidToken = 'invalidRefreshToken';
            jwt.verify.mockRejectedValue(new Error('Token expired'));

            req.body = { refreshToken: invalidToken };

            await refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.UNAUTHORIZED, "refresh.token.expired"));
        });
    });
});
