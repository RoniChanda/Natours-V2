const mongoose = require("mongoose");

//* feedbackSchema ***************************************************

const feedbackSchema = new mongoose.Schema({
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: [true, "Feedback must belong to a Review"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Feedback must belong to an user"],
  },
  feedback: {
    type: String,
    enum: {
      values: ["like", "unlike"],
      message: "Feedback can be only like or unlike",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//* Model **********************************************************

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
