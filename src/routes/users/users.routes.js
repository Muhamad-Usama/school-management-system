const express = require("express");
const {
    httpGetAllUsers, httpAddUser, httpUpdateUser, httpDeleteUser,
} = require("./users.controller");
const {addUserValidationRules} = require("../../middlewares/validations/users.validation");
const {validate} = require("../../middlewares/validations/validate");

const usersRouter = express.Router();

usersRouter.get("/", httpGetAllUsers);
usersRouter.post("/", addUserValidationRules, validate, httpAddUser);
usersRouter.put("/:id", httpUpdateUser);
usersRouter.delete("/:id", httpDeleteUser);

module.exports = usersRouter

