const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  marks: [
    {
      subject: {
        type: String,
      },
      marksobj: {
        type: Number,
      },
      marksoutof: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Student = mongoose.model("student", StudentSchema);
