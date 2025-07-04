import express from "express";
import favModel from "../models/fav.model.js";
import courseModel from "../models/course.model.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { id, title, image, link, username, isFavourite } = req.body;
  try {
    const exists = await favModel.findOne({ id, username });
    if (exists) {
      return res.status(200).json({ message: "Already added to favourites" });
    }
    const newFav = new favModel({
      id,
      title,
      image,
      link,
      username,
      isFavourite,
    });
    await newFav.save();
    return res.status(200).json({ message: "Added to favourites" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/get/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const favCourses = await favModel.find({ username });
    return res
      .status(200)
      .json({ message: "Successfully retrieved favourites", favCourses });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  try {
    await favModel.findOneAndDelete({ id, username });
    return res.status(200).json({ message: "Course removed from favourites" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
