const express = require('express');
const {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
} = require('./school.controller');
const {validateSchool} = require("../../middlewares/validations/school.validation");
const {validate} = require("../../middlewares/validations/validate");

const router = express.Router();

router.post('/', validateSchool, validate, httpCreateSchool); // Create a schools
router.get('/', httpGetSchools); // Get all schools
router.get('/:id', httpGetSchoolById); // Get schools by ID
router.put('/:id', validateSchool, validate, httpUpdateSchool); // Update schools by ID
router.delete('/:id', httpDeleteSchool); // Delete schools by ID

module.exports = router;
