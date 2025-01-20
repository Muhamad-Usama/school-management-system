const requestIp = require('request-ip');
const BaseResponse = require("../base/BaseResponse");
const StatusCodes = require("../constants/StatusCodes");
const {redisClient} = require("../config/redisClient");

const RATE_LIMIT_WINDOW = 60 * 60; // Time window in seconds (1 hour)
const MAX_REQUESTS = 100; // Max number of requests per window

const rateLimiter = async (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);  // Get the IP address from the request
    const key = `rate_limit:${clientIp}`;  // Use IP address as the key for rate limiting

    try {
        const currentRequests = await redisClient.get(key);

        if (currentRequests) {
            if (parseInt(currentRequests) >= MAX_REQUESTS) {
                return res.status(429).json(BaseResponse.error(StatusCodes.TOO_MANY_REQUESTS, 'rate.limit.exceeded'));
            }
        }

        // Increment the request count in Redis
        await redisClient.multi()
            .incr(key)
            .expire(key, RATE_LIMIT_WINDOW) // Expire the key after 1 hour
            .exec();

        next();  // Allow the request to continue if the limit isn't reached
    } catch (error) {
        console.error('Error during rate limiting:', error);
        return res.status(500).json(BaseResponse.error(StatusCodes.INTERNAL_SERVER_ERROR, 'internal.server.error'));
    }
};

module.exports = rateLimiter;
