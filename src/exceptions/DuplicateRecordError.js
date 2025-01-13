const StatusCodes = require("../constants/StatusCodes");

class DuplicateRecordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateRecordError';
        this.status = StatusCodes.DUPLICATE_RECORD;
    }
}

module.exports = DuplicateRecordError;
