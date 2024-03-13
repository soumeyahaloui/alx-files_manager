import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        // Check if email already exists
        const userExists = await dbClient.db.collection('users').findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        // Create new user
        const newUser = {
            email,
            password: sha1(password),
        };

        try {
            const insertResult = await dbClient.db.collection('users').insertOne(newUser);
            newUser.id = insertResult.insertedId;
            delete newUser.password; // Remove password from response
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default UsersController;