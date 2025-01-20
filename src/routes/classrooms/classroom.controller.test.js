const {
    httpCreateClassroom, httpGetClassrooms, httpGetClassroomById, httpUpdateClassroom, httpDeleteClassroom
} = require('../../routes/classrooms/classroom.controller');
const {
    findClassroomById, saveClassroom, updateClassroomById, deleteClassroomById, getAllClassrooms, existsClassroomByName
} = require('../../models/classrooms/classroom.model');
const BaseResponse = require('../../base/BaseResponse');
const StatusCodes = require('../../constants/StatusCodes');

jest.mock('../../models/classrooms/classroom.model');

describe('Classroom Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe('httpCreateClassroom', () => {
        it('should create a classroom successfully', async () => {
            req.body = { name: 'Classroom 1' };

            existsClassroomByName.mockResolvedValue(false);
            saveClassroom.mockResolvedValue({ id: 1, name: 'Classroom 1' });

            await httpCreateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ id: 1, name: 'Classroom 1' }));
        });

        it('should return 409 if classroom already exists', async () => {
            req.body = { name: 'Classroom 1' };

            existsClassroomByName.mockResolvedValue(true);

            await httpCreateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.DUPLICATE_RECORD, 'classrooms.already.exists'));
        });

        it('should handle error during classroom creation', async () => {
            req.body = { name: 'Classroom 1' };

            existsClassroomByName.mockResolvedValue(false);
            saveClassroom.mockRejectedValue(new Error('Save failed'));

            await httpCreateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'Save failed'));
        });
    });

    describe('httpGetClassrooms', () => {
        it('should return all classrooms', async () => {
            getAllClassrooms.mockResolvedValue([{ id: 1, name: 'Classroom 1' }, { id: 2, name: 'Classroom 2' }]);

            await httpGetClassrooms(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success([{ id: 1, name: 'Classroom 1' }, { id: 2, name: 'Classroom 2' }]));
        });

        it('should handle error during fetching classrooms', async () => {
            getAllClassrooms.mockRejectedValue(new Error('Fetch failed'));

            await httpGetClassrooms(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'Fetch failed'));
        });
    });

    describe('httpGetClassroomById', () => {
        it('should return classroom by ID', async () => {
            req.params.id = 1;
            findClassroomById.mockResolvedValue({ id: 1, name: 'Classroom 1' });

            await httpGetClassroomById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ id: 1, name: 'Classroom 1' }));
        });

        it('should return 404 if classroom not found', async () => {
            req.params.id = 999;
            findClassroomById.mockResolvedValue(null);

            await httpGetClassroomById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('classroom.not.found'));
        });

        it('should handle error during fetching classroom by ID', async () => {
            req.params.id = 1;
            findClassroomById.mockRejectedValue(new Error('Fetch failed'));

            await httpGetClassroomById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'Fetch failed'));
        });
    });

    describe('httpUpdateClassroom', () => {
        it('should update classroom successfully', async () => {
            req.params.id = 1;
            req.body = { name: 'Updated Classroom' };

            updateClassroomById.mockResolvedValue({ id: 1, name: 'Updated Classroom' });

            await httpUpdateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ id: 1, name: 'Updated Classroom' }));
        });

        it('should return 404 if classroom not found during update', async () => {
            req.params.id = 999;
            req.body = { name: 'Updated Classroom' };

            updateClassroomById.mockResolvedValue(null);

            await httpUpdateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('classroom.not.found'));
        });

        it('should handle error during classroom update', async () => {
            req.params.id = 1;
            req.body = { name: 'Updated Classroom' };

            updateClassroomById.mockRejectedValue(new Error('Update failed'));

            await httpUpdateClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'Update failed'));
        });
    });

    describe('httpDeleteClassroom', () => {
        it('should delete classroom successfully', async () => {
            req.params.id = 1;

            deleteClassroomById.mockResolvedValue({ id: 1 });

            await httpDeleteClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.success({ deleted: true }));
        });

        it('should return 404 if classroom not found during deletion', async () => {
            req.params.id = 999;

            deleteClassroomById.mockResolvedValue(null);

            await httpDeleteClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.notFoundError('classroom.not.found'));
        });

        it('should handle error during classroom deletion', async () => {
            req.params.id = 1;

            deleteClassroomById.mockRejectedValue(new Error('Deletion failed'));

            await httpDeleteClassroom(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'Deletion failed'));
        });
    });
});
