const {body} = require('express-validator');

const addUserValidationRules = [
    body('email').notEmpty().withMessage("user.email.required").bail().isEmail().withMessage('user.email.invalid').bail(),
    body('name').notEmpty().withMessage("user.name.required").bail()
        .isString().withMessage("user.name.invalid").bail().isLength({min: 3, max: 30})
        .withMessage('user.name.length').bail(),
    body('password').notEmpty().withMessage("user.password.required").bail().isLength({min: 8}).withMessage('user.password.min').bail()]


module.exports = {
    addUserValidationRules,
};
