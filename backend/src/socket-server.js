import { Server } from "socket.io";

const connectSocketServer = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.on("pose", (pose) => {
      socket.broadcast.emit("pose", pose);
    });
  });
};

export { connectSocketServer };
