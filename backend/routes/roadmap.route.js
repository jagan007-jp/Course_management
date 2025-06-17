import express, { text } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const router = express.Router();

router.post("/roadmap", async (req, res) => {
  const { subject } = req.body;
  if (!subject)
    return res.status(400).json({ error: "Subject field is required" });
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt1 = `Give detailed roadmap to learn ${subject}. No extra words, just the roadmap with the corresponding number of subtopics.
                    the line should break into a new line after every 10 to 12 words with a newline character and
                    2 newline character after every subheading. No ** and stuff`;

    const prompt2 = `Give a free website to learn the subject ${subject}, just the link, no other texts`;
    let result = await model.generateContent(prompt1);
    let response = await result.response;
    const text1 = response.text();
    result = await model.generateContent(prompt2);
    response = await result.response;
    const text2 = response.text();
    res.json({ text1, text2 });
  } catch (err) {
    return res.status(400).json({ error: "Error generating" });
  }
});

export default router;
