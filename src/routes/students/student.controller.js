const {
    createStudent,
    getStudentsBySchool,
    findStudentById,
    updateStudentById,
    existsStudentById,
    deleteStudentById,
    getAllStudents
} = require('../../models/students/student.model');
const BaseResponse = require("../../base/BaseResponse");
const StatusCodes = require("../../constants/StatusCodes");

const httpCreateStudent = async (req, res) => {
    try {
        const student = await createStudent(req.body);
        res.status(201).json(BaseResponse.success(student));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"))
    }
};

const httpGetStudents = async (req, res) => {
    try {
        const students = await getAllStudents();
        res.status(200).json(BaseResponse.success(students));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"))
    }
};

const httpGetStudentById = async (req, res) => {
    try {
        const student = await findStudentById(req.params.id);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success(student));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"))
    }
};

const httpUpdateStudent = async (req, res) => {
    try {
        const student = await updateStudentById(req.params.id, req.body);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success(student));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"))
    }
};

const httpDeleteStudent = async (req, res) => {
    try {
        const student = await deleteStudentById(req.params.id);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success({
            deleted: true,
        }));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"))
    }
};

module.exports = {
    httpCreateStudent, httpGetStudents, httpGetStudentById, httpUpdateStudent, httpDeleteStudent
};
