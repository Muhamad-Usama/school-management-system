const {createClient} = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("redis.client.error", err));

const redisClient = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        console.log("redis.client.connected");
    } catch (error) {
        console.error("redis.client.failed", error);
        throw error;
    }
};

module.exports = {redisClient, connectRedis: redisClient};
