import bodyParser from "body-parser";
import express from "express";
import http from "http";
import brain from "./brain/index.js";
import { addTrainingPose, getAllPoses } from "./database/index.js";
import socket from "./socket-server.js";

const app = express();
const server = http.createServer(app);

socket.connectTo(server);

app.use(express.static("../frontend/public"));

app.use(bodyParser.json());

app.get("/poses", async (req, res) => {
  const poses = await getAllPoses();
  res.json(poses);
});

app.use("/brain/model", express.static("./brain/weights"));

app.get("/brain/info", async (req, res) => {
  res.json(await brain.getInfo());
});

app.get("/brain/iterations", (req, res) => {
  res.json(brain.getIterations());
});

app.get("/brain/weights", async (req, res) => {
  res.json(await brain.getWeights());
});

app.post("/trainingData", (req, res) => {
  addTrainingPose(req.body)
    .then(() => res.status(200).send("Poses saved"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving poses");
    });
});

server.listen(8080, () => {
  console.log("server listening on port 8080");
});
