const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {i18nMiddleware} = require("./config/i18n.js");
const userRouter = require("./routes/users/users.routes");

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
}));

// Add the i18n middleware` to the Express app
app.use(i18nMiddleware);

app.use(express.json({limit: '3mb'}));

app.use(morgan("combined"));

// add routes here
app.use("/api/users", userRouter);

module.exports = app;

