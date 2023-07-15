const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  details: {
    type: String,
    required: true,
  },
  problemId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;
