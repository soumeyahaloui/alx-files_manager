// controllers/UsersController.js

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const UsersController = {
    async getMe(req, res) {
        const token = req.headers['x-token'];
        
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const user = await dbClient.db.collection('users').findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const { _id, email } = user;
        return res.status(200).json({ id: _id, email });
    }
};

export default UsersController;