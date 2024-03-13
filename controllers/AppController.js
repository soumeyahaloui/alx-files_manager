// controllers/AppController.js

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
    async getStatus(req, res) {
        const status = {
            redis: redisClient.isAlive(),
            db: dbClient.isAlive()
        };
        res.status(200).json(status);
    },

    async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();
        res.status(200).json({ users, files });
    }
};

export default AppController;
