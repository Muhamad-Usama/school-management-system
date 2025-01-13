const StatusCodes = require("../constants/StatusCodes");

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.status = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;