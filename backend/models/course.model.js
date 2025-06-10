import mongoose from "mongoose";

const courseSchema  = new mongoose.Schema({
    id: Number,
    image: String,
    title: String,
    link: String
});

const courseModel = mongoose.model("courses",courseSchema);

export default courseModel;