const School = require('./school.mongo');

const createSchool = async (schoolData) => {
    const school = new School(schoolData);
    return await school.save();
};

/**
 * Get all schools with pagination.
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<Array<Object>>}
 */
async function findAllSchools(limit = 10, skip = 0) {
    return School.find({}, {__v: 0, _id: 1}) // Exclude sensitive fields
        .sort({name: 1}) // Sort by name alphabetically
        .skip(skip)
        .limit(limit);
}

const getSchoolById = async (id) => {
    return  School.findOne({_id: id});
};

const updateSchool = async (id, schoolData) => {
    return School.findOneAndUpdate({_id: id}, schoolData, {new: true});
};

const deleteSchool = async (id) => {
    const result = await School.deleteOne({_id: id});
    return result.deletedCount === 1;
};

module.exports = {
    createSchool, findAllSchools, getSchoolById, updateSchool, deleteSchool
};
