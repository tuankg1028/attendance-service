require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import "./configs/mongoose.config";
import "./jobs/cron";
import { errorHandler } from "./middlewares/error-handle";
import attendanceRoutes from "./routes/attendance";
import schoolRoutes from "./routes/school";
import { initSocketIO } from "./configs/socketio";

const app = express();
const server = http.createServer(app);

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Init Socket io
initSocketIO(server);

// Set up routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/school", schoolRoutes);

app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
