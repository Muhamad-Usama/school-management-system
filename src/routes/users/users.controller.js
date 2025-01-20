const {
    getAllUsers, saveUser, updateUserById, deleteUserById, existsUserWithEmail, existsUserById
} = require("../../models/users/users.model");
const {getPagination} = require("../../utils/query");
const BaseResponse = require("../../base/BaseResponse");
const DuplicateRecordError = require("../../exceptions/DuplicateRecordError");
const NotFoundError = require("../../exceptions/NotFoundError");
const StatusCodes = require("../../constants/StatusCodes");

/**
 * Get all users with pagination. Limit and skip are optional query parameters. Default limit is 10. Default skip is 0.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

async function httpGetAllUsers(req, res) {
    try {
        const {limit, skip} = getPagination(req.query);
        const users = await getAllUsers(limit, skip);
        return res.status(200).json(BaseResponse.success(users));
    } catch (e) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
}

/**
 * Add a new user. Check if user with email already exists. If not, save the user.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

async function httpAddUser(req, res) {
    const user = req.body;

    // Check if user with email already exists
    if (await existsUserWithEmail(user.email)) {
        return res.status(400).json(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, "email.already.exists"));
    }

    try {
        const savedUser = await saveUser(user);
        return res.status(201).json(BaseResponse.success(savedUser));
    } catch (err) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
}

/**
 * Update user details.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

async function httpUpdateUser(req, res) {
    const userId = req.params.id;
    const updateData = req.body;

    const userExists = await existsUserById(userId);
    if (!userExists) {
        return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "user.not.found"));
    }

    try {
        const updatedUser = await updateUserById(userId, updateData);
        return res.status(200).json(BaseResponse.success(updatedUser));
    } catch (err) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
}

/**
 * Delete a user by ID.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */

async function httpDeleteUser(req, res) {
    const userId = req.params.id;
    // Check if user exists
    const userExists = await existsUserById(userId);
    if (!userExists) {
        return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "user.not.found"));
    }

    try {
        const deleted = await deleteUserById(userId);
        return res.status(200).json(BaseResponse.success({
            deleted
        }));
    } catch (err) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
}

module.exports = {
    httpGetAllUsers, httpAddUser, httpUpdateUser, httpDeleteUser,
};
