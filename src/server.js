require("dotenv").config();
const app = require("./app");
const { connectMongo } = require("./config/mongo");
const { connectRedis } = require("./config/redisClient");
const { INTERNAL_SERVER_ERROR } = require("./constants/StatusCodes");
const BaseResponse = require("./base/BaseResponse");

async function initConnections() {
    try {
        // Initialize MongoDB and Redis connections
        await connectMongo();
        await connectRedis();
    } catch (error) {
        console.error("Error initializing connections:", error);
        throw new Error("Failed to connect to services");
    }
}

// Vercel expects an exported handler function, not an HTTP server
module.exports = async (req, res) => {
    try {
        // Initialize MongoDB and Redis connections before handling the request
        await initConnections();

        // Pass the request and response to the Express app
        app(req, res);  // Vercel will invoke this for each request
    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json(BaseResponse.error(INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
};
