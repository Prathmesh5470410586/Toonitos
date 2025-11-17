const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
  videoUrl: String,
  thumb: String
});

const ShowSchema = new mongoose.Schema({
  title: String,
  description: String,
  genres: [String],
  ageGroup: { type: String, default: "0-12" },
  poster: String,
  heroVideo: String,
  episodes: [EpisodeSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Show", ShowSchema);
