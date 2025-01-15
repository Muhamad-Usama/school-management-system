const Classroom = require('./classrooms.mongo');

/**
 * Find a classroom by ID.
 * @param {string} classroomId
 * @returns {Promise<Object>}
 */
async function findClassroomById(classroomId) {
    return Classroom.findOne({id: classroomId});
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
    return Classroom.findOneAndUpdate({id: classroomId}, updateData, {new: true});
}

/**
 * Check if a classroom exists by ID.
 * @param {string} classroomId
 * @returns {Promise<boolean>}
 */
async function existsClassroomById(classroomId) {
    const classroom = await findClassroomById(classroomId);
    return !!classroom;
}

/**
 * Delete a classroom by ID.
 * @param {string} classroomId
 * @returns {Promise<boolean>}
 */
async function deleteClassroomById(classroomId) {
    const result = await Classroom.deleteOne({id: classroomId});
    return result.deletedCount === 1;
}

/**
 * Get all classrooms with pagination.
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<Array<Object>>}
 */
async function getAllClassrooms(limit, skip) {
    return Classroom.find({}, {__v: 0, _id: 0})
        .sort({name: 1}) // Optional: sort by name alphabetically
        .skip(skip)
        .limit(limit);
}

module.exports = {
    findClassroomById, saveClassroom, updateClassroomById, existsClassroomById, deleteClassroomById, getAllClassrooms
};
