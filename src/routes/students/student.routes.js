const express = require('express');
const {
    httpCreateStudent, httpGetStudents, httpGetStudentById, httpUpdateStudent, httpDeleteStudent
} = require('./student.controller');
const {validateStudent} = require("../../middlewares/validations/student.validation");
const {validate} = require("../../middlewares/validations/validate");

const router = express.Router();

router.post('/', validateStudent, validate, httpCreateStudent);
router.get('/', httpGetStudents);
router.get('/:id', httpGetStudentById);
router.put('/:id', validateStudent, validate, httpUpdateStudent);
router.delete('/:id', httpDeleteStudent);

module.exports = router;
