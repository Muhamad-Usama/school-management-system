const express = require("express");
const {signIn, signUp} = require("./auth.controller");
const {signUpValidations} = require("../../middlewares/validations/auth.validation");
const {validate} = require("../../middlewares/validations/validate");

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUpValidations, validate, signUp);

module.exports = authRouter