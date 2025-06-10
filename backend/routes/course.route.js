import express from 'express'
import courseModel from '../models/course.model.js'
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error',(err)=>{console.log("Redis Error: ",err)});
await redisClient.connect();

const router = express.Router();

router.get("/courses",async(req,res)=>{
    const offset = req.query.offset;
    const limit = req.query.limit;
    const cachedKey = `courses:${offset}:${limit}`;
    try{
        const cached = await redisClient.get(cachedKey);
        if(cached){
            return res.status(200).json({courses:JSON.parse(cached)});
        }
        const courses = await courseModel.find().skip(offset).limit(limit);
        await redisClient.set(cachedKey, JSON.stringify(courses), {EX:3600});
        if(!courses || courses.length === 0){
            return res.status(200).json({message:"No more courses found"});
        }
        return res.status(200).json({message:"Fetched courses successfully",courses});
    }catch(err){
        return res.status(500).json({message:"Server Error"});
    }
})

export default router;