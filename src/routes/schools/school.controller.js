const {
    createSchool, getSchools, getSchoolById, updateSchool, deleteSchool
} = require('../../models/schools/school.model');
const BaseResponse = require("../../base/BaseResponse");
const NotFoundError = require("../../exceptions/NotFoundError");

const httpCreateSchool = async (req, res) => {
    try {
        const school = await createSchool(req.body);
        res.status(201).json(BaseResponse.success(school));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpGetSchools = async (req, res) => {
    try {
        const schools = await getSchools();
        res.status(200).json(BaseResponse.success(schools));
    } catch (error) {
        throw new Error(error.message)
    }
};

const httpGetSchoolById = async (req, res) => {
    try {
        const school = await getSchoolById(req.params.id);
        if (!school) {
            throw new NotFoundError("schools.not.found")
        }
        res.status(200).json(BaseResponse.success(school));
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error(error.message)
    }
};

const httpUpdateSchool = async (req, res) => {
    try {
        const school = await updateSchool(req.params.id, req.body);
        if (!school) {
            throw new NotFoundError("schools.not.found")
        }
        res.status(200).json(BaseResponse.success(school));
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error(error.message)
    }
};

const httpDeleteSchool = async (req, res) => {
    try {
        const school = await deleteSchool(req.params.id);
        if (!school) {
            throw new NotFoundError("schools.not.found")
        }
        res.status(200).json({
            deleted: true,
        });
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error(error.message)
    }
};

module.exports = {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
};
