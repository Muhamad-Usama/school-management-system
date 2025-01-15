const StatusCodes = require("../constants/StatusCodes");

class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCredentialsError';
        this.status = StatusCodes.INVALID_CREDENTIALS;
    }
}

module.exports = InvalidCredentialsError;
