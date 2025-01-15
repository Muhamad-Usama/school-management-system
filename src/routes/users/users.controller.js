const {
    getAllUsers, saveUser, updateUserById, deleteUserById, existsUserWithEmail, existsUserById
} = require("../../models/users/users.model");
const {getPagination} = require("../../utils/query");
const BaseResponse = require("../../base/BaseResponse");
const DuplicateRecordError = require("../../exceptions/DuplicateRecordError");
const NotFoundError = require("../../exceptions/NotFoundError");

/**
 * Get all users with pagination. Limit and skip are optional query parameters. Default limit is 10. Default skip is 0.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

async function httpGetAllUsers(req, res) {
    const {limit, skip} = getPagination(req.query);
    const users = await getAllUsers(limit, skip);
    return res.status(200).json(BaseResponse.success(users));
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
        throw new DuplicateRecordError("email.already.exists");
    }

    try {
        const savedUser = await saveUser(user);
        return res.status(201).json(BaseResponse.success(savedUser));
    } catch (err) {
        throw new Error(err.message);
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
        throw new NotFoundError('user.not.found');
    }

    try {
        const updatedUser = await updateUserById(userId, updateData);
        return res.status(200).json(BaseResponse.success(updatedUser));
    } catch (err) {
        throw new Error(err.message);
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
        throw new NotFoundError('user.not.found');
    }

    try {
        const deleted = await deleteUserById(userId);
        return res.status(200).json(BaseResponse.success({
            deleted
        }));
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    httpGetAllUsers, httpAddUser, httpUpdateUser, httpDeleteUser,
};
