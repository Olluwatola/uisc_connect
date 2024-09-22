import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtIssuer, jwtSecret } from "../utils/constants";
//import User, { UserDocument } from "./../models/User";
import {
  ioSendSocketError,
  ioSendSocketResponse,
} from "../sockets/socketControllers/SocketResponseController";
import { io } from "../sockets/index";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  if (
    socket.handshake.query &&
    socket.handshake.query.token &&
    socket.handshake.query.chatID
  ) {
    let payload = jwt.verify(
      socket.handshake.query.token as string,
      jwtSecret as string
    );
    if (!payload || (payload as JwtPayload).iss !== jwtIssuer) {
      return next(new Error("error in payload"));
    }
    //const user = await User.findById((payload as UserDocument).id).exec();

    // if (!user) {
    //   return next(new Error("ensure user is logged in"));
    // }

    const { chatID } = socket.handshake.query;

    // if (user?.id !== chatID) {
    //   return next(new Error("user jwt or user id not valid"));
    // }
    //socket.data.user = user as UserDocument;
    socket.join(chatID);
    ioSendSocketResponse(io, socket, "handshake successfully");
    return next();
  } else {
    ioSendSocketError(io, socket, "either token or chatid not found in query");
    return next(new Error("either token or chatid not found in query "));
  }
};
