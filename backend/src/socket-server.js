const createIo = require("socket.io");
const connect = (server) => {
  const io = createIo(server);

  io.on("connection", (socket) => {
    socket.on("pose", (pose) => {
      socket.broadcast.emit("pose", pose);
    });
  });
};

module.exports = {
  connect,
};
