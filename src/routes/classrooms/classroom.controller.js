const {
    findClassroomById,
    saveClassroom,
    updateClassroomById,
    deleteClassroomById,
    getAllClassrooms,
    existsClassroomByName
} = require('../../models/classrooms/classroom.model');
const BaseResponse = require("../../base/BaseResponse");
const StatusCodes = require("../../constants/StatusCodes");

const httpCreateClassroom = async (req, res) => {
    try {
        const exists = await existsClassroomByName(req.body.name);
        if(exists) {
            return res.status(409).json(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, 'classrooms.already.exists'));
        }
        const classroom = await saveClassroom(req.body);
        res.status(201).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpGetClassrooms = async (req, res) => {
    try {
        const classrooms = await getAllClassrooms();
        res.status(200).json(BaseResponse.success(classrooms));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpGetClassroomById = async (req, res) => {
    try {
        const classroom = await findClassroomById(req.params.id);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classroom.not.found'));
        }
        res.status(200).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpUpdateClassroom = async (req, res) => {
    try {
        const classroom = await updateClassroomById(req.params.id, req.body);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classroom.not.found'));
        }
        res.status(200).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpDeleteClassroom = async (req, res) => {
    try {
        const classroom = await deleteClassroomById(req.params.id);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classroom.not.found'));
        }
        res.status(200).json(BaseResponse.success({deleted: true}));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
};
