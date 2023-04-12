import moment from "moment";

import { validRecordAttendance } from "../validators";
import attendanceModel from "../models/attendance";
import schoolModel from "../models/school";
import attendanceAggregationModel from "../models/attendance-aggregation";
import { BadRequestError } from "../utils/errors";
import { API_TYPES } from "../utils/constants";

async function recordAttendance(req, res, next) {
  try {
    validRecordAttendance(req.body);

    const { userId, schoolId, type, temperature, image } = req.body;

    const school = await schoolModel.findById(schoolId);
    if (!school) {
      throw new BadRequestError("schoolId is not found");
    }

    const newAttendance = await attendanceModel.create({
      userId,
      schoolId,
      type,
      temperature,
      image,
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    next(error);
  }
}

async function getFeverEvents(req, res, next) {
  try {
    const feverEvents = await attendanceAggregationModel.find({
      apiType: API_TYPES.FEVER,
    });

    res.json(feverEvents);
  } catch (error) {
    next(error);
  }
}

async function getSchoolAttendanceMetrics(req, res, next) {
  try {
    const { period, schoolId } = req.query;
    const periods = ["day", "week", "month"];
    if (!periods.includes(period)) {
      throw new BadRequestError("Invalid period");
    }

    const school = await schoolModel.findById(schoolId);
    if (!school) {
      throw new BadRequestError("schoolId is not found");
    }

    const attendanceData = await getSchoolAttendance({
      period,
      schoolId,
    });

    res.json(attendanceData);
  } catch (error) {
    next(error);
  }
}

async function getSchoolAttendance(filter) {
  const { period, schoolId } = filter;
  const startDate = moment().startOf(period);
  const endDate = moment().endOf(period);
  const attendanceData = await attendanceAggregationModel.find({
    date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    schoolId,
    apiType: API_TYPES.ATTENDANCE,
  });

  return attendanceData;
}
module.exports = {
  recordAttendance,
  getFeverEvents,
  getSchoolAttendanceMetrics,
  getSchoolAttendance,
};
