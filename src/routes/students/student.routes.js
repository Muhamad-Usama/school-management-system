const express = require('express');
const {
    httpCreateStudent, httpGetStudents, httpGetStudentById, httpUpdateStudent, httpDeleteStudent
} = require('./student.controller');
const {validateStudent} = require("../../middlewares/validations/student.validation");
const {validate} = require("../../middlewares/validations/validate");
const {authGuard} = require("../../middlewares/auth.middleware");
const rateLimiter = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post('/', authGuard(["Superadmin", "Administrator"]), rateLimiter, validateStudent, validate, httpCreateStudent);
router.get('/', authGuard(["Superadmin", "Administrator"]), rateLimiter, httpGetStudents);
router.get('/:id', authGuard(["Superadmin", "Administrator", "Student"]), rateLimiter, httpGetStudentById);
router.put('/:id', authGuard(["Superadmin", "Administrator"]), rateLimiter, validateStudent, validate, httpUpdateStudent);
router.delete('/:id', authGuard(["Superadmin", "Administrator"]), rateLimiter, httpDeleteStudent);

module.exports = router;
