const http = require("http");
require("dotenv").config();
const app = require("./app");
const {INTERNAL_SERVER_ERROR} = require("./constants/StatusCodes");
const BaseResponse = require("./base/BaseResponse");
const {connectMongo} = require("./config/mongo");
const {connectRedis} = require("./config/redisClient");
const {translate} = require("./config/i18n");
const PORT = process.env.PORT || 8000;

app.use(async (err, req, res, next) => {
    const errorCode = err.status ?? INTERNAL_SERVER_ERROR;
    const errorMessage = err.message.trim() ?? "something.went.wrong";
    return res.status(200).json(BaseResponse.error(errorCode, errorMessage));
});

// create server with http module
const server = http.createServer(app);

async function startServer() {
    await connectMongo();
    await connectRedis();
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().then(() => console.log("Server started successfully")).catch(console.error);
