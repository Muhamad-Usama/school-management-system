const express = require("express");
const {
    httpGetAllUsers, httpAddUser, httpUpdateUser, httpDeleteUser,
} = require("./users.controller");
const {validate} = require("../../middlewares/validations/validate");
const {signupValidator} = require("../../middlewares/validations/auth.validation");
const {authGuard} = require("../../middlewares/auth.middleware");
const rateLimiter = require("../../middlewares/rateLimiter.middleware");

const usersRouter = express.Router();

usersRouter.get("/", authGuard(["Superadmin"]), rateLimiter, httpGetAllUsers);
usersRouter.post("/", authGuard(["Superadmin"]), rateLimiter, signupValidator, validate, httpAddUser);
usersRouter.put("/:id", authGuard(["Superadmin"]), rateLimiter, signupValidator, validate, httpUpdateUser);
usersRouter.delete("/:id", authGuard(["Superadmin"]), rateLimiter, httpDeleteUser);

module.exports = usersRouter

