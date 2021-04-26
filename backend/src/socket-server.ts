import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let _resolveIo: (v: SocketServer) => void;
const io: Promise<SocketServer> = new Promise((res) => {
  _resolveIo = res;
});

const connectTo = (server: HttpServer) => {
  const _io = new SocketServer(server);

  _io.on("connection", (socket) => {
    socket.on("pose", (pose) => {
      socket.broadcast.emit("pose", pose);
    });
  });

  _resolveIo(_io);
};

async function send(eventType: string, msg?: any) {
  (await io).local.emit(eventType, msg);
}

export default { connectTo, send };
