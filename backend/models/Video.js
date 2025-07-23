const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  videoID: String,
  title: String,
  channel: String,
  duration: String,
  thumbnail: String,
  transcript: [String],
  mappedConcepts: [
    {
      subject: String,
      chapter: String,
      section: String,
      page: Number,
      matchScore: Number,
    },
  ],
});

module.exports = mongoose.model("Video", VideoSchema);
