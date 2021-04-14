const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static("../view/public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/test", (req, res) => {
  res.json({ test: "okay" });
});

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("pose", (pose) => {
    socket.broadcast.emit("pose", pose);
  });
});

app.post("/training", (req, res) => {
  console.log("HEADERS", req.headers);
  console.log("BODY", req.body);
  // fs.WriteFileSync("asd.json", {asd})
  res.status(200).send();
});

server.listen(8080, () => {
  console.log("server listening on port 8080");
});
