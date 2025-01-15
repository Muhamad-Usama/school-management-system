const { body } = require('express-validator');

const validateClassroom = [
    body('name').notEmpty().withMessage('classroom.name.required').bail(),
    body('schoolId').notEmpty().withMessage('school.id.required').bail(),
    body('capacity').isInt({ min: 1 }).withMessage('classroom.capacity.invalid')
];

module.exports = { validateClassroom };
