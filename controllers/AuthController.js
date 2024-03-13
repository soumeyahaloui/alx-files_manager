// controllers/AuthController.js

import uuidv4 from 'uuid/v4';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AuthController = {
    async getConnect(req, res) {
        const credentials = req.headers.authorization.split(' ')[1];
        const [email, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');
        
        const user = await dbClient.db.collection('users').findOne({ email, password: sha1(password) });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const token = uuidv4();
        await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
        
        return res.status(200).json({ token });
    },
    
    async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        await redisClient.del(`auth_${token}`);
        return res.status(204).send();
    }
};

export default AuthController;