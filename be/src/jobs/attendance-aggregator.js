import moment from "moment";
import { Promise } from "bluebird";

import "../configs/mongoose.config";
import { handleAttendanceDataChanged } from "../configs/socketio";
import attendanceModel from "../models/attendance";
import schoolModel from "../models/school";
import attendanceAggregationModel from "../models/attendance-aggregation";

async function aggregateSchoolAttendance(school) {
  try {
    const period = "month";
    const { totalStudents, _id: schoolId } = school;
    const startDate = moment().startOf(period);
    const endDate = moment().endOf(period);
    const attendanceData = await attendanceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          schoolId: schoolId,
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          checkins: { $push: { type: "$type", createdAt: "$createdAt" } },
        },
      },
      {
        $addFields: {
          checkouts: {
            $filter: {
              input: "$checkins",
              as: "checkin",
              cond: { $eq: ["$$checkin.type", "checkout"] },
            },
          },
          checkins: {
            $filter: {
              input: "$checkins",
              as: "checkin",
              cond: { $eq: ["$$checkin.type", "checkin"] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          date: "$_id.date",
          isPresent: {
            $cond: {
              if: {
                $and: [
                  { $gt: [{ $size: "$checkins" }, 0] },
                  { $gt: [{ $size: "$checkouts" }, 0] },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          present: {
            $sum: { $cond: [{ $eq: ["$isPresent", true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          present: "$present",
          absent: { $subtract: [totalStudents, "$present"] },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const schooIdsWithNewData = [];
    for (let i = 0; i < attendanceData.length; i++) {
      const { date, present, absent } = attendanceData[i];

      const attendanceDate = await attendanceAggregationModel.findOne({
        date,
        schoolId,
      });

      // Update new record if there is no record for the date
      if (!attendanceDate) {
        await attendanceAggregationModel.create({
          date,
          present,
          absent,
          schoolId,
          school,
          apiType: "attendance",
        });

        continue;
      }

      // Update the current record if it has a new data
      if (
        attendanceDate.present !== present ||
        attendanceDate.absent !== absent
      ) {
        schooIdsWithNewData.push(schoolId.toString());

        // update new data
        await attendanceAggregationModel.updateOne(
          {
            _id: attendanceDate.id,
          },
          {
            $set: {
              present,
              absent,
            },
          }
        );
      }
    }

    // emit new attendance data to client
    await handleAttendanceDataChanged(schooIdsWithNewData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("aggregateSchoolAttendance job failed:", error);
  }
}

async function aggregateFeverEvents() {
  try {
    const feverThreshold = 38; // Fever threshold in Celsius
    let result = await attendanceModel.aggregate([
      {
        $match: {
          temperature: { $gte: feverThreshold },
        },
      },
      {
        $group: {
          _id: "$schoolId",
          feverEventsCount: { $sum: 1 },
        },
      },
    ]);

    await Promise.map(result, async (feverEvent) => {
      const school = await schoolModel.findById(feverEvent._id);

      const schoolFeverEvents = await attendanceAggregationModel.findOne({
        schoolId: school.id,
        apiType: "fever",
      });

      if (!schoolFeverEvents) {
        await attendanceAggregationModel.create({
          schoolId: school.id,
          school,
          feverEventsCount: feverEvent.feverEventsCount,
          apiType: "fever",
        });

        return;
      }

      // Update new feverEventsCount if it has a new data
      if (schoolFeverEvents.feverEventsCount !== feverEvent.feverEventsCount) {
        await attendanceAggregationModel.updateOne(
          {
            _id: schoolFeverEvents.id,
          },
          {
            $set: {
              feverEventsCount: feverEvent.feverEventsCount,
            },
          }
        );
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("aggregateFeverEvents job failed:", error);
  }
}

// Define a function to perform attendance data aggregation
async function aggregateAttendanceData() {
  await aggregateFeverEvents();

  const schools = await schoolModel.find();

  await Promise.map(schools, aggregateSchoolAttendance, { concurrency: 4 });
}

// Schedule the attendance data aggregation task to run every day at midnight

module.exports = { aggregateAttendanceData };
