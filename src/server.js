const http = require("http");
require("dotenv").config();
const app = require("./app");
const {INTERNAL_SERVER_ERROR} = require("./constants/StatusCodes");
const BaseResponse = require("./base/BaseResponse");
const PORT = process.env.PORT || 8000;

app.use(async (err, req, res, next) => {
    const errorCode = err.status ?? INTERNAL_SERVER_ERROR;
    const errorMessage = await req.t(err.message.trim() ?? "something_went_wrong");
    console.log(req.language)

    console.log( errorCode, errorMessage)
    return res.status(500).json(BaseResponse.error(errorCode, errorMessage));
});

// create server with http module
const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().then(() => console.log("Server started successfully")).catch(console.error);
