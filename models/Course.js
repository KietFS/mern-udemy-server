const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  topic: {
    type: String,
    enum: ["Web", "CyberSec", "Mobile", "AI"],
  },
  title: {
    type: String,
    required: true,
  },
  lecture: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("courses", CourseSchema);
