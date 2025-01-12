const http = require("http");
require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 8000;

// create src with http module
const server = http.createServer(app);

async function startServer() {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().then(r => console.log(r)).catch(e => console.error(e));
