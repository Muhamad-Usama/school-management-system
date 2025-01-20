const jwt = require("jsonwebtoken");
const BaseResponse = require("../base/BaseResponse");
const {findUserByEmail} = require("../models/users/users.model");
const StatusCodes = require("../constants/StatusCodes");

/**
 * Middleware for role-based access control.
 * @param {Array} roles - Roles allowed to access the endpoint.
 */
const authGuard = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json(BaseResponse.error(StatusCodes.UNAUTHORIZED, "unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await findUserByEmail(decoded.email);

            if (!user || !user.active) {
                return res.status(401).json(BaseResponse.error(StatusCodes.NOT_FOUND, "user.not.found"));
            }

            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json(BaseResponse.error(StatusCodes.FORBIDDEN, "resource.forbidden"));
            }

            req.user = user; // Attach user data to the request
            next();
        } catch (error) {
            res.status(401).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "user.auth.failed"));
        }
    };
};

module.exports = {authGuard};
