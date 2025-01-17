const {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
} = require('../../routes/schools/school.controller');
const {
    createSchool, getSchools, getSchoolById, updateSchool, deleteSchool
} = require('../../models/schools/school.model');
const BaseResponse = require('../../base/BaseResponse');
const NotFoundError = require('../../exceptions/NotFoundError');

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
        await expect(httpCreateSchool(req, res)).rejects.toThrow('Creation failed');
    });

    it('gets all schools successfully', async () => {
        getSchools.mockResolvedValue([{id: 1, name: 'Test School'}]);
        await httpGetSchools(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(BaseResponse.success([{id: 1, name: 'Test School'}]));
    });

    it('handles error during fetching all schools', async () => {
        getSchools.mockRejectedValue(new Error('Fetch failed'));
        await expect(httpGetSchools(req, res)).rejects.toThrow('Fetch failed');
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
        await expect(httpGetSchoolById(req, res)).rejects.toThrow(NotFoundError);
    });

    it('handles error during fetching school by ID', async () => {
        getSchoolById.mockRejectedValue(new Error('Fetch failed'));
        req.params.id = 1;
        await expect(httpGetSchoolById(req, res)).rejects.toThrow('Fetch failed');
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
        await expect(httpUpdateSchool(req, res)).rejects.toThrow(NotFoundError);
    });

    it('handles error during school update', async () => {
        updateSchool.mockRejectedValue(new Error('Update failed'));
        req.params.id = 1;
        req.body = {name: 'Updated School'};
        await expect(httpUpdateSchool(req, res)).rejects.toThrow('Update failed');
    });

    it('deletes a school by ID successfully', async () => {
        deleteSchool.mockResolvedValue({id: 1});
        req.params.id = 1;
        await httpDeleteSchool(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({deleted: true});
    });

    it('returns 404 if school not found during deletion', async () => {
        deleteSchool.mockResolvedValue(null);
        req.params.id = 999;
        await expect(httpDeleteSchool(req, res)).rejects.toThrow(NotFoundError);
    });

    it('handles error during school deletion', async () => {
        deleteSchool.mockRejectedValue(new Error('Deletion failed'));
        req.params.id = 1;
        await expect(httpDeleteSchool(req, res)).rejects.toThrow('Deletion failed');
    });
});