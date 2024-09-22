import { Socket, Server } from "socket.io";
import { ChatroomMessageReponse } from "../../interfaces/chatroom";

export const ioSendSocketResponse = (
  io: Server,
  socket: Socket,
  message: string
): void => {
  io.to(socket.id).emit("response", message);
};

export const ioSendSocketResponseToRoom = (
  io: Server,
  room: string,
  message: string | ChatroomMessageReponse,
  type: "notif" | "message"
): void => {
  io.to(room).emit("chatroomMessage", message, {
    type: type ? type : "notif",
    chatroomId: room,
  });
};

export const ioSendSocketResponseToEntity = (
  io: Server,
  id: string,
  message: string | ChatroomMessageReponse,
  type: "notif" | "message"
): void => {
  io.to(id).emit("entityMessage", message, {
    type: type ? type : "notif",
    id: id,
  });
};

export const ioSendSocketError = (
  io: Server,
  socket: Socket,
  message: string | null,
  details?: {
    type: string;
    chatroomId: string;
    message: string;
  }
): void => {
  io.to(socket.id).emit("Error", details ? details : message);
};

export const ioSendEntitySocketError = (
  io: Server,
  socket: Socket,
  message: string | null,
  details?: {
    type: string;
    id: string | undefined;
    message: string;
  }
): void => {
  io.to(socket.id).emit("Error", details ? details : message);
};

export const ioSendSocketResponseToChat = (
  io: Server,
  socket: Socket,
  senderID: string,
  recipientID: string,
  message: string,
  from: string,
  type: string
) => {
  io.to([recipientID, senderID]).emit("recievePrivateMessage", {
    message,
    from,
    senderID,
    recipientID,
    type,
  });
};
