import mongoose, { mongo } from "mongoose";

const favSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  link: String,
  username: String,
  isFavourite: Boolean,
});

const favModel = mongoose.model("favourites", favSchema);

export default favModel;
