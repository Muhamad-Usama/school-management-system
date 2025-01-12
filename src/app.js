const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();


app.use(cors({
    origin: ["http://localhost:3000"],
}));

app.use(express.json({limit: '3mb'}));

app.use(morgan("combined"));

module.exports = app;

