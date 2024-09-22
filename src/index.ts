import app from "./configs/App";
import { Server as HttpServer } from "http";
import { mongoUri, portNumber } from "./utils/constants";
import mongoose from "mongoose";
import socketSetup from "./sockets";
import setUpCronJobs from "./cron";

let server: HttpServer;

mongoose
  .connect(mongoUri as string, {})
  .then(() => {
    console.log("mongodb is running.");
    // Start the server and get the server instance
    server = app.listen(parseInt(portNumber as string), () => {
      console.log(("app is running on port: " + portNumber) as string);
      //setup sockets
      socketSetup(server);
      setUpCronJobs();
    });
  })
  .catch((e) => console.error(e));
