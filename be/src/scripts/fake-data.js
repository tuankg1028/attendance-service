import { faker } from "@faker-js/faker";
import moment from "moment";
import { Promise } from "bluebird";

import "../configs/mongoose.config";
import attendanceModel from "../models/attendance";
import schoolModel from "../models/school";

// Function to generate fake attendance records
async function generateAttendanceRecords(schoolId) {
  const attendanceRecords = [];

  // Generate a random temperature between 35C and 40C
  const minTemperature = 35;
  const maxTemperature = 40;

  // Generate 10,000 attendance records for each school for each workday (Monday to Friday)
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  for (let i = 0; i < daysOfWeek.length; i++) {
    const date = moment().day(daysOfWeek[i]).toDate();
    for (let j = 0; j < 10000; j++) {
      const temperature = faker.datatype.float({
        min: minTemperature,
        max: maxTemperature,
        precision: 0.1,
      });
      const attendanceRecord = {
        schoolId,
        userId: faker.random.numeric(2),
        temperature,
        createdAt: date,
        type: j % 2 == 0 ? "checkin" : "checkout",
        image: faker.image.imageUrl(),
      };
      attendanceRecords.push(attendanceRecord);
    }
  }
  await attendanceModel.insertMany(attendanceRecords);
  // eslint-disable-next-line no-console
  console.log(`Attendance records generated for school ${schoolId}`);
}

// Function to generate fake schools
function generateSchools() {
  const schools = [];

  // Generate 1000 schools
  for (let i = 0; i < 1000; i++) {
    const school = {
      name: faker.company.name(),
      location: faker.address.streetAddress(),
      totalStudents: 110,
    };
    schools.push(school);
  }
  return schoolModel.insertMany(schools);
}

// Call the functions to generate fake data
generateSchools().then(async (schools) => {
  // eslint-disable-next-line no-console
  console.log("Schools generated");

  await Promise.map(
    schools,
    (school) => {
      return generateAttendanceRecords(school._id);
    },
    {
      concurrency: 10,
    }
  );
});
