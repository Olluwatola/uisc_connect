//4 logging levels
//error for flat out 500s
//warn for logs of things that need to fixed or watched out for
//info for notice logs
//silly for other logs

import winston, { createLogger, format, transports } from "winston";
import { LogInfo } from "../interfaces/logger";
//import { MongoDB } from "winston-mongodb"; // Import winston-mongodb transport
//import { mongoUri } from "./../utils/constants";

const { combine, timestamp, json, printf, colorize } = format;

const env = process.env.NODE_ENV || "staging"; // Get the environment

// Define MongoDB options for winston-mongodb transport
// const mongoDBOptions = {
//   db: mongoUri,
//   options: { useUnifiedTopology: true },
//   collection: "logs",
//   capped: false,
//   leaveConnectionOpen: false,
//   storeHost: false,
// };

// Add the environment to each log entry
const addEnvironment = format((info: LogInfo) => {
  info.environment = env; // Add environment to the log entry
  return info;
});

// Initialize the transports array
const loggerTransports: winston.transport[] = [
  //   new MongoDB({
  //     ...mongoDBOptions,
  //     format: combine(
  //       addEnvironment(), // Include the environment in the logs
  //       json() // Format logs as JSON
  //     ),
  //}),
];

// Add console transport in staging environment
if (env === "staging") {
  loggerTransports.push(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        printf(
          (info: LogInfo) =>
            `[${info.timestamp}] ${info.level.toUpperCase()} [${
              info.environment
            }]: ${info.message}`
        )
      ),
      level: "silly",
    })
  );
}

// Create the logger with the defined transports
const logger = createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    addEnvironment(), // Add environment to all log entries
    printf(
      (info: LogInfo) =>
        `[${info.timestamp}] ${info.level.toUpperCase()} [${
          info.environment
        }]: ${info.message}`
    )
  ),
  transports: loggerTransports,
  handleExceptions: true,
  handleRejections: true,
  exitOnError: false,
});

// Add an additional console transport specifically for errors in staging and dev

logger.add(
  new transports.Console({
    level: "error",
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      printf(
        (info: LogInfo) =>
          `[${info.timestamp}] ${info.level.toUpperCase()} [${
            info.environment
          }]: ${info.message}`
      )
    ),
  })
);

export default logger;
