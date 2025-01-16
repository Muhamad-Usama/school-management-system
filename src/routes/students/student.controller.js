const {
    createStudent, getStudents, getStudentById, updateStudent, deleteStudent
} = require('../../models/students/student.model');
const BaseResponse = require("../../base/BaseResponse");

const httpCreateStudent = async (req, res) => {
    try {
        const student = await createStudent(req.body);
        res.status(201).json(BaseResponse.success(student));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpGetStudents = async (req, res) => {
    try {
        const students = await getStudents();
        res.status(200).json(BaseResponse.success(students));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpGetStudentById = async (req, res) => {
    try {
        const student = await getStudentById(req.params.id);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success(student));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpUpdateStudent = async (req, res) => {
    try {
        const student = await updateStudent(req.params.id, req.body);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success(student));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpDeleteStudent = async (req, res) => {
    try {
        const student = await deleteStudent(req.params.id);
        if (!student) {
            return res.status(404).json(BaseResponse.notFoundError('student.not.found'));
        }
        res.status(200).json(BaseResponse.success({
            deleted: true,
        }));
    } catch (error) {
        throw new Error(error.message)
    }
};

module.exports = {
    httpCreateStudent, httpGetStudents, httpGetStudentById, httpUpdateStudent, httpDeleteStudent
};
