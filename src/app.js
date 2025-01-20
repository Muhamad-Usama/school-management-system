const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {i18nMiddleware} = require("./config/i18n.js");
const userRouter = require("./routes/users/users.routes");
const schoolRouter = require("./routes/schools/school.routes");
const classroomRouter = require("./routes/classrooms/classroom.routes");
const studentRouter = require("./routes/students/student.routes");
const authRouter = require("./routes/auth/auth.routes");

const app = express();

app.use(cors({
    origin: '*', // This allows all origins
}));


// Add the i18n middleware` to the Express app
app.use(i18nMiddleware);

app.use(express.json({limit: '3mb'}));

app.use(morgan("combined"));

// add routes here
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/schools", schoolRouter);
app.use("/api/classrooms", classroomRouter);
app.use("/api/students", studentRouter);

module.exports = app;

