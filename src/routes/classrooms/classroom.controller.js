const {
    findClassroomById, saveClassroom, updateClassroomById, deleteClassroomById, getAllClassrooms, existsClassroomByName
} = require('../../models/classrooms/classroom.model');
const BaseResponse = require("../../base/BaseResponse");
const StatusCodes = require("../../constants/StatusCodes");

const httpCreateClassroom = async (req, res) => {
    try {
        const exists = await existsClassroomByName(req.body.name);
        if (exists) {
            return res.status(409).json(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, 'classrooms.already.exists'));
        }
        const classroom = await saveClassroom(req.body);
        res.status(201).json(BaseResponse.success(classroom));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message ?? "internal.server.error"));
    }
};

const httpGetClassrooms = async (req, res) => {
    try {
        const classrooms = await getAllClassrooms();
        res.status(200).json(BaseResponse.success(classrooms));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message ?? "internal.server.error"));
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
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message ?? "internal.server.error"));
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
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message ?? "internal.server.error"));
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
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message ?? "internal.server.error"));
    }
};

module.exports = {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
};
