// Import the required Redis module
import redis from 'redis';

class RedisClient {
    constructor() {
        // Create a client to Redis
        this.client = redis.createClient();

        // Handle Redis client errors
        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    // Check if the connection to Redis is alive
    isAlive() {
        return this.client.connected;
    }

    // Get the value stored in Redis for a given key
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) reject(err);
                else resolve(reply);
            });
        });
    }

    // Store a value in Redis with an expiration time
    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    // Remove a value from Redis for a given key
    async del(key) {
        this.client.del(key);
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
