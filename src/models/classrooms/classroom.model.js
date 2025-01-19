const Classroom = require('./classroom.mongo');
const {Types} = require("mongoose");

/**
 * Find a classroom by ID.
 * @param {string} classroomId
 * @returns {Promise<Object>}
 */
async function findClassroomById(classroomId) {
    // Convert the string to an ObjectId
    return  Classroom.findOne({_id: classroomId});
}

/**
 * Save a new classroom to the database.
 * @param {Object} classroom
 * @returns {Promise<void>}
 */
async function saveClassroom(classroom) {
    return Classroom.create(classroom);
}

/**
 * Update classroom details.
 * @param {string} classroomId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
async function updateClassroomById(classroomId, updateData) {
    return Classroom.findOneAndUpdate({_id: classroomId}, updateData, {new: true});
}

/**
 * Check if a classroom exists by ID.
 * @param {string} classroomId
 * @returns {Promise<boolean>}
 */
async function existsClassroomById(classroomId) {
    const classroom = await findClassroomById(classroomId);
    return classroom !== null && classroom !== undefined;
}

/**
 * Check if a classroom exists by name.
 * @returns {Promise<boolean>}
 * @param name
 */
async function existsClassroomByName(name) {
    const classroom = await Classroom.findOne({name: name});
    return classroom !== null && classroom !== undefined;
}

/**
 * Delete a classroom by ID.
 * @param {string} classroomId
 * @returns {Promise<boolean>}
 */
async function deleteClassroomById(classroomId) {
    const result = await Classroom.deleteOne({_id: classroomId});
    return result.deletedCount === 1;
}

/**
 * Get all classrooms with pagination.
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<Array<Object>>}
 */
async function getAllClassrooms(limit, skip) {
    return Classroom.find({}, {__v: 0, _id: 1})
        .sort({name: 1}) // Optional: sort by name alphabetically
        .skip(skip)
        .limit(limit);
}

module.exports = {
    findClassroomById,
    saveClassroom,
    updateClassroomById,
    existsClassroomById,
    deleteClassroomById,
    getAllClassrooms,
    existsClassroomByName
};
