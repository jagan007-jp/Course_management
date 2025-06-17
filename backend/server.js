import dotenv from "dotenv";
dotenv.config();
import courseRoute from "./routes/course.route.js";
import authRoute from "./routes/user.route.js";
import favRoute from "./routes/fav.route.js";
import roadmapRoute from "./routes/roadmap.route.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

app.use("/api/users", authRoute);
app.use("/api/home", courseRoute);
app.use("/api/fav", favRoute);
app.use("/api/ai", roadmapRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
