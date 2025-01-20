const express = require("express");
const {signIn, signUp, refreshToken} = require("./auth.controller");
const {signupValidator} = require("../../middlewares/validations/auth.validation");
const {validate} = require("../../middlewares/validations/validate");

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signupValidator, validate, signUp);
authRouter.post("/refresh-token", refreshToken);

module.exports = authRouter