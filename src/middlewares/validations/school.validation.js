const {body} = require('express-validator');

const validateSchool = [body('name').notEmpty().withMessage('school.name.required').bail(), body('address').notEmpty().withMessage('school.address.required').bail(), body('contactEmail').isEmail().withMessage('school.contactEmail.invalid').bail(), body('contactPhone').notEmpty().withMessage('school.contactPhone.required'),];

module.exports = {validateSchool};
