const School = require('./school.mongo');

const createSchool = async (schoolData) => {
    const school = new School(schoolData);
    return await school.save();
};

const getSchools = async () => {
    return School.find();
};

const getSchoolById = async (id) => {
    return School.findById(id);
};

const updateSchool = async (id, schoolData) => {
    return School.findByIdAndUpdate(id, schoolData, {new: true});
};

const deleteSchool = async (id) => {
    return School.findByIdAndDelete(id);
};

module.exports = {
    createSchool, getSchools, getSchoolById, updateSchool, deleteSchool
};
