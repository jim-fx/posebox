const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const socketServer = require("./socket-server");

const http = require("http");

const app = express();
const server = http.createServer(app);
socketServer.connect(server);

app.use(express.static("../frontend/public"));

app.use(bodyParser.json());

const rawJson = fs.readFileSync(
  path.resolve(__dirname, "data/poses.json"),
  "utf-8"
);
const poses = JSON.parse(rawJson);
app.get("/poses", (req, res) => {
  res.json(poses);
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
