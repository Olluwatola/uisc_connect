import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { authenticateSocket } from "../middlewares/authenticateSocket";
import { handleConnection } from "./events";
import logger from "../configs/logger";

const io = new Server({
  cors: {
    origin: "*",
  },
});

const socketSetup = (httpServer: HttpServer) => {
  try {
    io.attach(httpServer);
    io.use(authenticateSocket).on("connection", handleConnection);
  } catch (error) {
    logger.error("Error in socketSetup", error);
  }
};

export default socketSetup;
export { io }; // Export io instance for use in other files
