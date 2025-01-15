const StatusCodes = require('../constants/StatusCodes');
const {translate} = require("../config/i18n");

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

    static notFoundError(message) {
        return new this.error(StatusCodes.NOT_FOUND, translate(message));
    }
}

module.exports = BaseResponse;