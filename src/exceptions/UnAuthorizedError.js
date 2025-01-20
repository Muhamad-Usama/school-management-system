const StatusCodes = require("../constants/StatusCodes");

class UnAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnAuthorizedError';
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnAuthorizedError;