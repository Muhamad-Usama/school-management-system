const {validationResult} = require("express-validator");
const InvalidDataError = require("../../exceptions/InvalidDataError");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array()[0].msg ?? "fields.validation.failed";
        throw new InvalidDataError(message);
    }
    next();
};

module.exports = {
    validate
};