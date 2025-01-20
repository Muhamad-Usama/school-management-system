const express = require('express');
const {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
} = require('./school.controller');
const {validateSchool} = require("../../middlewares/validations/school.validation");
const {validate} = require("../../middlewares/validations/validate");
const {authGuard} = require("../../middlewares/auth.middleware");
const rateLimiter = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post('/', authGuard(["Superadmin"]), rateLimiter, validateSchool, validate, httpCreateSchool); // Create a schools
router.get('/', authGuard(["Superadmin"]), rateLimiter, httpGetSchools); // Get all schools
router.get('/:id', authGuard(["Superadmin"]), rateLimiter, httpGetSchoolById); // Get schools by ID
router.put('/:id', authGuard(["Superadmin"]), rateLimiter, validateSchool, validate, httpUpdateSchool); // Update schools by ID
router.delete('/:id', authGuard(["Superadmin"]), rateLimiter, httpDeleteSchool); // Delete schools by ID

module.exports = router;
