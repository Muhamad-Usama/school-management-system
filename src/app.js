const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {i18nMiddleware} = require("./config/i18n.js");
const BaseResponse = require("./base/BaseResponse");
const UnAuthorizedError = require("./exceptions/UnAuthorizedError");


const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
}));

// Add the i18n middleware` to the Express app
app.use(i18nMiddleware);

app.use(express.json({limit: '3mb'}));

app.use(morgan("combined"));


app.get("/", (req, res) => {
    const token = req.headers["Authorization"];
    if (!token) {
        throw new UnAuthorizedError("unauthorized");
    }
    return res.status(200).json(BaseResponse.success({message: "Hello World"}));
});

module.exports = app;

