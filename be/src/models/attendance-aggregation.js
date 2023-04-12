const mongoose = require("mongoose");

const attendanceAggregationSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  school: {
    type: mongoose.Schema.Types.Mixed,
  },
  date: {
    type: Date,
  },
  present: {
    type: Number,
  },
  absent: {
    type: Number,
  },
  feverEventsCount: {
    type: Number,
  },
  apiType: {
    type: String,
    enum: ["attendance", "fever"],
    required: true,
  },
});

const AttendanceAggregation = mongoose.model(
  "AttendanceAggregation",
  attendanceAggregationSchema
);

module.exports = AttendanceAggregation;
