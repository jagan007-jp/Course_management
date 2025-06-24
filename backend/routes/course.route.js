import express from "express";
import courseModel from "../models/course.model.js";

const router = express.Router();

router.get("/courses", async (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;
  try {
    const courses = await courseModel.find().skip(offset).limit(limit);
    if (!courses || courses.length === 0) {
      return res.status(200).json({ message: "No more courses found" });
    }
    return res
      .status(200)
      .json({ message: "Fetched courses successfully", courses });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
