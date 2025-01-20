const Student = require('./student.mongo');

/**
 * Create a new student and save to the database.
 * @param {Object} studentData
 * @returns {Promise<Object>}
 */
async function createStudent(studentData) {
    const student = new Student(studentData);
    return await student.save();
}

/**
 * Get all students associated with a specific school.
 * @param {string} schoolId
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<Array<Object>>}
 */
async function getStudentsBySchool(schoolId, limit = 10, skip = 0) {
    return Student.find({schoolId}, {__v: 0, _id: 1}) // Exclude sensitive fields
        .sort({name: 1}) // Sort by name alphabetically
        .skip(skip)
        .limit(limit);
}

/**
 * Find a student by their unique ID.
 * @param {string} studentId
 * @returns {Promise<Object>}
 */
async function findStudentById(studentId) {
    return Student.findOne({_id: studentId});
}

/**
 * Update a student's details.
 * @param {string} studentId
 * @param {Object} studentData
 * @returns {Promise<Object>}
 */
async function updateStudentById(studentId, studentData) {
    return Student.findOneAndUpdate({_id: studentId}, studentData, {new: true});
}

/**
 * Check if a student exists by ID.
 * @param {string} studentId
 * @returns {Promise<boolean>}
 */
async function existsStudentById(studentId) {
    const student = await findStudentById(studentId);
    return student !== null && student !== undefined; // Return true if the student exists
}

/**
 * Delete a student by ID.
 * @param {string} studentId
 * @returns {Promise<boolean>}
 */
async function deleteStudentById(studentId) {
    const result = await Student.deleteOne({_id: studentId});
    return result.deletedCount === 1;
}

/**
 * Get all students with pagination.
 * @param {number} limit
 * @param {number} skip
 * @returns {Promise<Array<Object>>}
 */
async function getAllStudents(limit = 10, skip = 0) {
    return Student.find({}, {__v: 0, _id: 1}) // Exclude sensitive fields
        .sort({name: 1}) // Sort by name alphabetically
        .skip(skip)
        .limit(limit);
}

module.exports = {
    createStudent,
    getStudentsBySchool,
    findStudentById,
    updateStudentById,
    existsStudentById,
    deleteStudentById,
    getAllStudents
};
