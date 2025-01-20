const express = require('express');
const {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
} = require('./classroom.controller');
const {validateClassroom} = require("../../middlewares/validations/classroom.validation");
const {validate} = require("../../middlewares/validations/validate");
const {authGuard} = require("../../middlewares/auth.middleware");
const rateLimiter = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post('/', authGuard(["Superadmin", "Administrator"]), rateLimiter, validateClassroom, validate, httpCreateClassroom);
router.get('/', authGuard(["Superadmin", "Administrator"]), rateLimiter, httpGetClassrooms);
router.get('/:id', authGuard(["Superadmin", "Administrator"]), rateLimiter, httpGetClassroomById);
router.put('/:id', authGuard(["Superadmin", "Administrator"]), rateLimiter, validateClassroom, validate, httpUpdateClassroom);
router.delete('/:id', authGuard(["Superadmin", "Administrator"]), rateLimiter, httpDeleteClassroom);

module.exports = router;
