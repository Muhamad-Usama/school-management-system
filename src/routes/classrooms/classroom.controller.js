const {
    createClassroom, getClassrooms, getClassroomById, updateClassroom, deleteClassroom
} = require('../../models/classrooms/classroom.model');
const BaseResponse = require("../../base/BaseResponse");

const httpCreateClassroom = async (req, res) => {
    try {
        const classroom = await createClassroom(req.body);
        res.status(201).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpGetClassrooms = async (req, res) => {
    try {
        const classrooms = await getClassrooms();
        res.status(200).json(BaseResponse.success(classrooms));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpGetClassroomById = async (req, res) => {
    try {
        const classroom = await getClassroomById(req.params.id);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classrooms.not.found'));
        }
        res.status(200).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpUpdateClassroom = async (req, res) => {
    try {
        const classroom = await updateClassroom(req.params.id, req.body);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classrooms.not.found'));
        }
        res.status(200).json(BaseResponse.success(classroom));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const httpDeleteClassroom = async (req, res) => {
    try {
        const classroom = await deleteClassroom(req.params.id);
        if (!classroom) {
            return res.status(404).json(BaseResponse.notFoundError('classrooms.not.found'));
        }
        res.status(200).json(BaseResponse.success({deleted: true}));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
};
