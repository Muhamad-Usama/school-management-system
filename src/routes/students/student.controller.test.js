const {
    httpCreateStudent, httpGetStudents, httpGetStudentById, httpUpdateStudent, httpDeleteStudent
} = require('../../routes/students/student.controller');
const {
    createStudent,
    findStudentById,
    updateStudentById,
    deleteStudentById,
    getAllStudents
} = require('../../models/students/student.model');
const BaseResponse = require('../../base/BaseResponse');
const StatusCodes = require('../../constants/StatusCodes');

jest.mock('../../models/students/student.model');

describe('Student Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {body: {}, params: {}};
        res = {
            status: jest.fn().mockReturnThis(), json: jest.fn()
        };
    });

    it('should create a student successfully', async () => {
        createStudent.mockResolvedValue({id: 1, name: 'Test Student'});
        req.body = {name: 'Test Student'};
        await httpCreateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Test Student'}));
    });

    it('should handle error during student creation', async () => {
        createStudent.mockRejectedValue(new Error('Creation failed'));
        req.body = {name: 'Test Student'};
        await httpCreateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('should get all students successfully', async () => {
        getAllStudents.mockResolvedValue([{id: 1, name: 'Test Student'}]);
        await httpGetStudents(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success([{id: 1, name: 'Test Student'}]));
    });

    it('should handle error during fetching all students', async () => {
        getAllStudents.mockRejectedValue(new Error('Fetch failed'));
        await httpGetStudents(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('should get a student by ID successfully', async () => {
        findStudentById.mockResolvedValue({id: 1, name: 'Test Student'});
        req.params.id = 1;
        await httpGetStudentById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Test Student'}));
    });

    it('should return 404 if student not found by ID', async () => {
        findStudentById.mockResolvedValue(null);
        req.params.id = 999;
        await httpGetStudentById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('student.not.found'));
    });

    it('should handle error during fetching student by ID', async () => {
        findStudentById.mockRejectedValue(new Error('Fetch failed'));
        req.params.id = 1;
        await httpGetStudentById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('should update a student by ID successfully', async () => {
        updateStudentById.mockResolvedValue({id: 1, name: 'Updated Student'});
        req.params.id = 1;
        req.body = {name: 'Updated Student'};
        await httpUpdateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Updated Student'}));
    });

    it('should return 404 if student not found during update', async () => {
        updateStudentById.mockResolvedValue(null);
        req.params.id = 999;
        req.body = {name: 'Updated Student'};
        await httpUpdateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('student.not.found'));
    });

    it('should handle error during student update', async () => {
        updateStudentById.mockRejectedValue(new Error('Update failed'));
        req.params.id = 1;
        req.body = {name: 'Updated Student'};
        await httpUpdateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('should delete a student by ID successfully', async () => {
        deleteStudentById.mockResolvedValue({id: 1});
        req.params.id = 1;
        await httpDeleteStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({
            deleted: true,
        }));
    });

    it('should return 404 if student not found during deletion', async () => {
        deleteStudentById.mockResolvedValue(null);
        req.params.id = 999;
        await httpDeleteStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('student.not.found'));
    });

    it('should handle error during student deletion', async () => {
        deleteStudentById.mockRejectedValue(new Error('Deletion failed'));
        req.params.id = 1;
        await httpDeleteStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });
});
