const {body} = require('express-validator');

const classroomValidationRules = [body('name')
    .notEmpty()
    .withMessage('classroom.name.required')
    .bail()
    .isString()
    .withMessage('classroom.name.invalid')
    .bail(),

    body('schoolId')
        .notEmpty()
        .withMessage('school.id.required')
        .bail()
        .isMongoId()
        .withMessage('school.id.invalid')
        .bail(),

    body('capacity')
        .notEmpty()
        .withMessage('classroom.capacity.required')
        .bail()
        .isInt({min: 1})
        .withMessage('classroom.capacity.invalid')
        .bail(),

    body('resources')
        .isArray()
        .withMessage('classroom.resources.invalid')
        .optional()
        .bail(),

    body('resources.*.type')
        .if(body('resources').exists())
        .notEmpty()
        .withMessage('classroom.resources.type.required')
        .bail()
        .isString()
        .withMessage('classroom.resources.type.invalid')
        .bail(),

    body('resources.*.quantity')
        .if(body('resources').exists())
        .notEmpty()
        .withMessage('classroom.resources.quantity.required')
        .bail()
        .isInt({min: 0})
        .withMessage('classroom.resources.quantity.invalid')
        .bail(),

    body('resources.*.condition')
        .if(body('resources').exists())
        .optional()
        .isIn(['New', 'Good', 'Fair', 'Poor'])
        .withMessage('classroom.resources.condition.invalid')
        .bail()];

module.exports = {validateClassroom: classroomValidationRules};

