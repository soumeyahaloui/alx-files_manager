// utils/redis.js

import redis from 'redis';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', (err) => {
            console.error(`Redis client not connected to the server: ${err}`);
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, value) => {
                if (error) reject(error);
                resolve(value);
            });
        });
    }

    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;
