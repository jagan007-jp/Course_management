import mongoose, { mongo } from "mongoose";

const favSchema = new mongoose.Schema({
    id: Number,
    title: String,
    image: String,
    link: String,
    username: String
});

const favModel = mongoose.model("favourites",favSchema);

export default favModel;