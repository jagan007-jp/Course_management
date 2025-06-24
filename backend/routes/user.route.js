import express from "express";
import userModel from "../models/user.model.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user1 = username.trim().toUpperCase();
  try {
    const user = await userModel.findOne({ username: user1, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = username.trim().toUpperCase();
    const exists = await userModel.findOne({ username: user });
    if (exists) {
      return res.status(401).json({ message: "User already exists" });
    }
    const newUser = new userModel({ username: user, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully", newUser });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
