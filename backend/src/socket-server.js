import { Server } from "socket.io";

let _resolveIo;
const io = new Promise((res) => {
  _resolveIo = res;
});

const connectTo = (server) => {
  const _io = new Server(server);

  _io.on("connection", (socket) => {
    socket.on("pose", (pose) => {
      socket.broadcast.emit("pose", pose);
    });
  });

  _resolveIo(_io);
};

async function send(eventType, msg) {
  (await io).local.emit(eventType, msg);
}

export default { connectTo, send };
