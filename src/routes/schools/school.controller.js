const {
    createSchool, findAllSchools, getSchoolById, updateSchool, deleteSchool
} = require('../../models/schools/school.model');
const BaseResponse = require("../../base/BaseResponse");
const StatusCodes = require("../../constants/StatusCodes");

const httpCreateSchool = async (req, res) => {
    try {
        const school = await createSchool(req.body);
        res.status(201).json(BaseResponse.success(school));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
};

const httpGetSchools = async (req, res) => {
    try {
        const schools = await findAllSchools();
        res.status(200).json(BaseResponse.success(schools));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
};

const httpGetSchoolById = async (req, res) => {
    try {
        const school = await getSchoolById(req.params.id);
        if (!school) {
            return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
        }
        res.status(200).json(BaseResponse.success(school));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
};

const httpUpdateSchool = async (req, res) => {
    try {
        const school = await updateSchool(req.params.id, req.body);
        if (!school) {
            return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
        }
        res.status(200).json(BaseResponse.success(school));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
};

const httpDeleteSchool = async (req, res) => {
    try {
        const school = await deleteSchool(req.params.id);
        if (!school) {
            return res.status(404).json(BaseResponse.error(StatusCodes.NOT_FOUND, "school.not.found"));
        }
        res.status(200).json(BaseResponse.success({
            deleted: true,
        }));
    } catch (error) {
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, "internal.server.error"));
    }
};

module.exports = {
    httpCreateSchool, httpGetSchools, httpGetSchoolById, httpUpdateSchool, httpDeleteSchool
};
