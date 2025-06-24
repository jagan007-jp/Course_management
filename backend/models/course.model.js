import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  id: Number,
  image: String,
  title: String,
  link: String,
  isFavourite: {
    type: Boolean,
    default: false,
  },
});

const courseModel = mongoose.model("courses", courseSchema);

export default courseModel;
