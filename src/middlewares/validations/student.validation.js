const { body } = require('express-validator');

const validateStudent = [
    body('firstName').notEmpty().withMessage('student.firstName.required').bail(),
    body('lastName').notEmpty().withMessage('student.lastName.required').bail(),
    body('email').isEmail().withMessage('student.email.invalid').bail(),
    body('dateOfBirth').notEmpty().withMessage('student.dateOfBirth.required').bail(),
    body('schoolId').notEmpty().withMessage('school.id.required'),
];

module.exports = { validateStudent };
