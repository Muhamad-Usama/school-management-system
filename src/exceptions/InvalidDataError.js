const StatusCodes = require("../constants/StatusCodes");

class InvalidDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDataError';
        this.status = StatusCodes.INVALID_DATA;
    }
}

module.exports = InvalidDataError;
