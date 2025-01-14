const {findUserByEmail, saveUser, existsUserWithEmail} = require("../../models/users/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BaseResponse = require("../../base/BaseResponse");
const InvalidCredentialsError = require("../../exceptions/InvalidCredentialsError");

/**
 * Handles user sign-in.
 * 1. Checks if the user exists by email.
 * 2. Compares the provided password with the stored hash.
 * 3. Generates a JWT token for the authenticated user.
 *
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object to send the result or error message.
 */
const signIn = async (req, res) => {
    const {email, password} = req.body;

    // Find user by email using model method
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
        throw new InvalidCredentialsError("invalid.credentials");
    }

    const isCorrectPassword = await bcrypt.compare(password, existingUser.password);

    if (!isCorrectPassword) {
        throw new InvalidCredentialsError("invalid.credentials");
    }

    try {

        // Generate JWT token
        const token = jwt.sign({id: existingUser._id, email: existingUser.email}, process.env.SECRET_KEY, // Secret key, use environment variables in production
            {expiresIn: "4h"});

        // Send response with user data and token
        res.status(200).json(BaseResponse.success({result: existingUser, token}));
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Handles user sign-up.
 * 1. Checks if the user already exists by email using model method.
 * 2. Verifies password confirmation.
 * 3. Hashes the password and creates a new user record using the model method.
 * 4. Generates a JWT token for the new user.
 *
 * @param {Object} req - The request object containing user sign-up data.
 * @param {Object} res - The response object to send the result or error message.
 */
const signUp = async (req, res) => {
    const {email, password, firstName, lastName, confirmPassword} = req.body;
    try {
        // Check if user already exists using model method
        const userExists = await existsUserWithEmail(email);
        if (userExists) {
            return res.status(409).send({message: "User Already Exists"});
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user object and save it using model method
        const user = {
            name: `${firstName} ${lastName}`, password: hashedPassword, email: email,
        };

        // Save user using the model method
        const result = await saveUser(user);

        // Generate JWT token
        const token = jwt.sign({id: result._id, email: email}, process.env.SECRET_KEY, {
            expiresIn: "4h",
        });

        // Send response with user data and token
        res.status(201).json(BaseResponse.success({result: result, token}));
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    signIn, signUp
}
