const mongoose = require("mongoose");

// server setup
const MONGO_URL = process.env.MONGO_URI;

// use once if you are sure that event will be emitted once

mongoose.connection.once("open", () => {
    console.log("connected to mongoose");
});

mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function connectMongo() {
    await mongoose.connect(MONGO_URL?.toString(), {
        useNewUrlParser: true, useUnifiedTopology: true,
    });
}

module.exports = {
    connectMongo,
};
