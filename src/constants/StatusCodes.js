const StatusCodes = {
    SUCCESS: 200, BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 1004, // Custom code for "not found"
    DUPLICATE_RECORD: 1005, // Custom code for "duplicate record"
    INVALID_DATA: 1006, // Custom code for "invalid data"
    INTERNAL_SERVER_ERROR: 500, // Add more codes as needed
    INVALID_CREDENTIALS: 1007, TOO_MANY_REQUESTS: 1029,
};

module.exports = StatusCodes;
