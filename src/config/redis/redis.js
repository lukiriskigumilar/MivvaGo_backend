import dotenv from 'dotenv';
dotenv.config();

import { createClient } from "redis";

const redisClient = createClient({
    url:process.env.REDIS_CLIENT, 
})

redisClient.on('error', (err)=> console.error('redis client error',err)); 

await redisClient.connect();

export default redisClient;