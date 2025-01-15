const {body} = require('express-validator');

const signUpValidations = [
    // Email validation
    body('email')
        .notEmpty()
        .withMessage("user.email.required")
        .bail()
        .isEmail()
        .withMessage("user.email.invalid")
        .bail(),

    // First name validation
    body('firstName')
        .notEmpty()
        .withMessage("user.firstName.required")
        .bail()
        .isString()
        .withMessage("user.firstName.invalid")
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage("user.firstName.length")
        .bail(),

    // Last name validation
    body('lastName')
        .notEmpty()
        .withMessage("user.lastName.required")
        .bail()
        .isString()
        .withMessage("user.lastName.invalid")
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage("user.lastName.length")
        .bail(),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage("user.password.required")
        .bail()
        .isLength({min: 8})
        .withMessage("user.password.min")
        .bail(),

    // Confirm password validation and matching with password
    body('confirmPassword')
        .notEmpty()
        .withMessage("user.confirmPassword.required")
        .bail()
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("user.confirmPassword.mismatch");
            }
            return true;
        })
        .bail()
];

const signInValidations = [
    // Email validation
    body('email')
        .notEmpty()
        .withMessage("user.email.required")
        .bail()
        .isEmail()
        .withMessage("user.email.invalid")
        .bail(),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage("user.password.required")
        .bail()
        .isLength({min: 8})
        .withMessage("user.password.min")
        .bail()
];

module.exports = {
    signUpValidations,
    signInValidations,
};
