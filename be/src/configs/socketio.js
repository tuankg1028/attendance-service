import { Server } from "socket.io";
import { Promise } from "bluebird";
import { getSchoolAttendance } from "../controllers/attendance";
let io;

const filterCriterias = {};
function initSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // eslint-disable-next-line no-console
    console.log(`Socket ${socket.id} connected`);

    // init filterCriterias
    filterCriterias[socket.id] = {
      schoolId: null,
      period: "month",
    };

    socket.on("filterUpdated", async (filterCriteria) => {
      filterCriterias[socket.id] = filterCriteria;

      const schoolAttendance = await getSchoolAttendance(filterCriteria);
      socket.emit("schoolAttendanceData", schoolAttendance);
    });

    socket.on("disconnect", () => {
      delete filterCriterias[socket.id];
      // eslint-disable-next-line no-console
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

async function handleAttendanceDataChanged(schoolIds) {
  // emit new data with user's filter criteria

  await Promise.map(
    Object.entries(filterCriterias),
    async ([socketId, filterCriteria]) => {
      const { schoolId } = filterCriteria;

      if (!schoolIds.includes(schoolId)) return;

      const schoolAttendance = await getSchoolAttendance(filterCriteria);
      io.to(socketId).emit("schoolAttendanceData", schoolAttendance);
    },
    {
      concurrency: 4,
    }
  );
}
module.exports = {
  initSocketIO,
  getIo,
  handleAttendanceDataChanged,
};
