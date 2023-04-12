const cron = require("node-cron");
const { aggregateAttendanceData } = require("./attendance-aggregator");

// Run the attendance data aggregator every five minutes

cron.schedule("*/5 * * * *", async () => {
  try {
    // eslint-disable-next-line no-console
    console.log("Running attendance aggregation job...");
    await aggregateAttendanceData();
    // eslint-disable-next-line no-console
    console.log("Attendance aggregation job complete.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Attendance aggregation job failed:", error);
  }
});
