const {body} = require('express-validator');

const studentValidationRules = [body('firstName')
    .notEmpty()
    .withMessage('validation.student.firstName.required')
    .bail()
    .isString()
    .withMessage('validation.student.firstName.invalid')
    .bail(),

    body('lastName')
        .notEmpty()
        .withMessage('validation.student.lastName.required')
        .bail()
        .isString()
        .withMessage('validation.student.lastName.invalid')
        .bail(),

    body('email')
        .notEmpty()
        .withMessage('validation.student.email.required')
        .bail()
        .isEmail()
        .withMessage('validation.student.email.invalid')
        .bail()
        .normalizeEmail()
        .isLength({max: 255})
        .withMessage('validation.student.email.maxLength')
        .bail(),

    body('dateOfBirth')
        .notEmpty()
        .withMessage('validation.student.dateOfBirth.required')
        .bail()
        .isDate()
        .withMessage('validation.student.dateOfBirth.invalid')
        .bail(),

    body('schoolId')
        .notEmpty()
        .withMessage('validation.student.schoolId.required')
        .bail()
        .isMongoId()
        .withMessage('validation.student.schoolId.invalid')
        .bail(),

    body('classroomId')
        .optional()
        .isMongoId()
        .withMessage('validation.student.classroomId.invalid')
        .bail(),

    body('profilePicture')
        .optional()
        .isURL()
        .withMessage('validation.student.profilePicture.invalid')
        .bail(),

    body('guardianDetails.name')
        .optional()
        .isString()
        .withMessage('validation.student.guardianDetails.name.invalid')
        .bail(),

    body('guardianDetails.contact')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('validation.student.guardianDetails.contact.invalid')
        .bail(),

    body('guardianDetails.relationship')
        .optional()
        .isString()
        .withMessage('validation.student.guardianDetails.relationship.invalid')
        .bail(),

    body('transferHistory.*.fromClassroomId')
        .optional()
        .isMongoId()
        .withMessage('validation.student.transferHistory.fromClassroomId.invalid')
        .bail(),

    body('transferHistory.*.toClassroomId')
        .optional()
        .isMongoId()
        .withMessage('validation.student.transferHistory.toClassroomId.invalid')
        .bail(),

    body('transferHistory.*.transferDate')
        .optional()
        .isDate()
        .withMessage('validation.student.transferHistory.transferDate.invalid')
        .bail(),

    body('transferHistory.*.reason')
        .optional()
        .isString()
        .withMessage('validation.student.transferHistory.reason.invalid')
        .bail(),

    body('transferHistory.*.notes')
        .optional()
        .isString()
        .withMessage('validation.student.transferHistory.notes.invalid')
        .bail()];

module.exports = {validateStudent: studentValidationRules};

