const express = require('express');
const {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
} = require('./classroom.controller');
const {validateClassroom} = require("../../middlewares/validations/classroom.validation");
const {validate} = require("../../middlewares/validations/validate");

const router = express.Router();

router.post('/', validateClassroom, validate, httpCreateClassroom);
router.get('/', httpGetClassrooms);
router.get('/:id', httpGetClassroomById);
router.put('/:id', validateClassroom, validate, httpUpdateClassroom);
router.delete('/:id', httpDeleteClassroom);

module.exports = router;
