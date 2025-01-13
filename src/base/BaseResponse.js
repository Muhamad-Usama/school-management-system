const StatusCodes = require('../constants/StatusCodes');

class BaseResponse {
    constructor(code, message = null, body = null) {
        this.code = code;
        this.message = message;
        this.body = body;
    }

    static success(body) {
        return new BaseResponse(StatusCodes.SUCCESS, "success", body);
    }

    static error(code, message) {
        return new BaseResponse(code, message);
    }
}

module.exports = BaseResponse;