const {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
} = require('../../routes/schools/school.controller');
const {
    createSchool, findAllSchools, getSchoolById, updateSchool, deleteSchool
} = require('../../models/schools/school.model');
const BaseResponse = require('../../base/BaseResponse');
const StatusCodes = require("../../constants/StatusCodes");

jest.mock('../../models/schools/school.model');

describe('School Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {body: {}, params: {}};
        res = {
            status: jest.fn().mockReturnThis(), json: jest.fn()
        };
    });

    it('creates a school successfully', async () => {
        createSchool.mockResolvedValue({id: 1, name: 'Test School'});
        req.body = {name: 'Test School'};
        await httpCreateSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Test School'}));
    });

    it('handles error during school creation', async () => {
        createSchool.mockRejectedValue(new Error('Creation failed'));
        req.body = {name: 'Test School'};
        await httpCreateSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('gets all schools successfully', async () => {
        findAllSchools.mockResolvedValue([{id: 1, name: 'Test School'}]);
        await httpGetSchools(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success([{id: 1, name: 'Test School'}]));
    });

    it('handles error during fetching all schools', async () => {
        findAllSchools.mockRejectedValue(new Error('Fetch failed'));
        await httpGetSchools(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('gets a school by ID successfully', async () => {
        getSchoolById.mockResolvedValue({id: 1, name: 'Test School'});
        req.params.id = 1;
        await httpGetSchoolById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Test School'}));
    });

    it('returns 404 if school not found by ID', async () => {
        getSchoolById.mockResolvedValue(null);
        req.params.id = 999;
        await httpGetSchoolById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
    });

    it('handles error during fetching school by ID', async () => {
        getSchoolById.mockRejectedValue(new Error('Fetch failed'));
        req.params.id = 1;
        await httpGetSchoolById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('updates a school by ID successfully', async () => {
        updateSchool.mockResolvedValue({id: 1, name: 'Updated School'});
        req.params.id = 1;
        req.body = {name: 'Updated School'};
        await httpUpdateSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({id: 1, name: 'Updated School'}));
    });

    it('returns 404 if school not found during update', async () => {
        updateSchool.mockResolvedValue(null);
        req.params.id = 999;
        req.body = {name: 'Updated School'};
        await httpUpdateSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
    });

    it('handles error during school update', async () => {
        updateSchool.mockRejectedValue(new Error('Update failed'));
        req.params.id = 1;
        req.body = {name: 'Updated School'};
        await httpUpdateSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });

    it('deletes a school by ID successfully', async () => {
        deleteSchool.mockResolvedValue({id: 1});
        req.params.id = 1;
        await httpDeleteSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success({deleted: true}));
    });

    it('returns 404 if school not found during deletion', async () => {
        deleteSchool.mockResolvedValue(null);
        req.params.id = 999;
        await httpDeleteSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
    });

    it('handles error during school deletion', async () => {
        deleteSchool.mockRejectedValue(new Error('Deletion failed'));
        req.params.id = 1;
        await httpDeleteSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    });
});
