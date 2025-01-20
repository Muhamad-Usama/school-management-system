# School Management System

A Node.js-based school management system built with Express and MongoDB and Redis.

## Prerequisites

1. **Node.js**: Download and install [Node.js](https://nodejs.org/).
2. **MongoDB**: Install MongoDB locally or use a cloud-based service
   like [MongoDB Atlas](https://www.mongodb.com/atlas/database).
3. **Redis**: Install Redis locally.

## Installation on Ubuntu Sever etc.

1. Clone the repository:
   ```bash
   git clone git@github.com:Muhamad-Usama/school-management-system.git
   cd school-management-system

2. Setup environment variables:
   ```bash like
    REDIS_URL=redis://redis:6379
    MONGODB_URI=mongodb://mongo:27017/school-management-system
    SECRET_KEY=your jwt secret key
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    PORT=8000
   ```

3. Install the docker and run the following commands, you can see then app runs on port 8000
   ```bash
   sudo docker-compose up -d
   sudo docker-compose logs app
   ```

