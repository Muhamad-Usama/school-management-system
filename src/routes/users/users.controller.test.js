const {
    httpGetAllUsers, httpAddUser, httpUpdateUser, httpDeleteUser
} = require('../users/users.controller');
const {
    getAllUsers, saveUser, updateUserById, deleteUserById, existsUserWithEmail, existsUserById
} = require('../../models/users/users.model');
const BaseResponse = require('../../base/BaseResponse');
const { getPagination } = require('../../utils/query');
const StausCodes = require("../../constants/StatusCodes");

jest.mock('../../models/users/users.model');
jest.mock('../../utils/query');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, query: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe('httpGetAllUsers', () => {
        it('should return all users with pagination', async () => {
            getPagination.mockReturnValue({ limit: 10, skip: 0 });
            getAllUsers.mockResolvedValue([{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }]);

            await httpGetAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success([{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }]));
        });

        it('should handle error during fetching users', async () => {
            getPagination.mockReturnValue({ limit: 10, skip: 0 });
            getAllUsers.mockRejectedValue(true);

            await httpGetAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(500, "internal.server.error"));
        });
    });

    describe('httpAddUser', () => {
        it('should add a user successfully', async () => {
            const newUser = { email: 'user@example.com', name: 'Test User' };
            req.body = newUser;

            existsUserWithEmail.mockResolvedValue(false);
            saveUser.mockResolvedValue({ id: 1, ...newUser });

            await httpAddUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ id: 1, ...newUser }));
        });

        it('should return error if email already exists', async () => {
            const newUser = { email: 'user@example.com', name: 'Test User' };
            req.body = newUser;

            existsUserWithEmail.mockResolvedValue(true);

            await httpAddUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StausCodes.DUPLICATE_RECORD, 'email.already.exists'));
        });

        it('should handle error during user creation', async () => {
            const newUser = { email: 'user@example.com', name: 'Test User' };
            req.body = newUser;

            existsUserWithEmail.mockResolvedValue(false);
            saveUser.mockRejectedValue(true);

            await httpAddUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(500, 'internal.server.error'));
        });
    });

    describe('httpUpdateUser', () => {
        it('should update a user successfully', async () => {
            const updatedUser = { name: 'Updated User' };
            req.body = updatedUser;
            req.params.id = 1;

            existsUserById.mockResolvedValue(true);
            updateUserById.mockResolvedValue({ id: 1, ...updatedUser });

            await httpUpdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ id: 1, ...updatedUser }));
        });

        it('should return 404 if user not found during update', async () => {
            const updatedUser = { name: 'Updated User' };
            req.body = updatedUser;
            req.params.id = 999;

            existsUserById.mockResolvedValue(false);

            await httpUpdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(1004, 'user.not.found'));
        });

        it('should handle error during user update', async () => {
            const updatedUser = { name: 'Updated User' };
            req.body = updatedUser;
            req.params.id = 1;

            existsUserById.mockResolvedValue(true);
            updateUserById.mockRejectedValue(new Error('Update failed'));

            await httpUpdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(500, 'internal.server.error'));
        });
    });

    describe('httpDeleteUser', () => {
        it('should delete a user successfully', async () => {
            req.params.id = 1;

            existsUserById.mockResolvedValue(true);
            deleteUserById.mockResolvedValue(true);

            await httpDeleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ deleted: true }));
        });

        it('should return 404 if user not found during deletion', async () => {
            req.params.id = 999;

            existsUserById.mockResolvedValue(false);

            await httpDeleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(1004, 'user.not.found'));
        });

        it('should handle error during user deletion', async () => {
            req.params.id = 1;

            existsUserById.mockResolvedValue(true);
            deleteUserById.mockRejectedValue(new Error('Deletion failed'));

            await httpDeleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(500, 'internal.server.error'));
        });
    });
});
