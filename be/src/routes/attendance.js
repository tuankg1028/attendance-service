import express from "express";

import attendanceController from "../controllers/attendance";

const router = express.Router();

router.post("/", attendanceController.recordAttendance);
router.get("/fever-events", attendanceController.getFeverEvents);
router.get("/school-metrics", attendanceController.getSchoolAttendanceMetrics);

module.exports = router;
