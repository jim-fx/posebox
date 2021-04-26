import express from "express";
import { createServer } from "http";
import brain from "./brain";
import * as config from "./config";
import db from "./database";
import socket from "./socket-server";

const app = express();
const server = createServer(app);

socket.connectTo(server);

app.use(express.static("../frontend/public"));

app.use(express.json());

app.get("/poses", async (req, res) => {
  res.json(await db.getAllPoses());
});

app.use("/brain/model", express.static("./brain/weights"));

app.get("/brain/info", async (req, res) => {
  res.json(await brain.getInfo());
});

app.get("/brain/iterations", (req, res) => {
  res.json(brain.getIterations());
});

app.post("/brain/reset", (req, res) => {
  res.json(brain.reset());
});

app.get("/brain/weights", async (req, res) => {
  res.json(await brain.getWeights());
});

app.post("/trainingData", (req, res) => {
  db.addTrainingPose(req.body)
    .then(() => res.status(200).send("Poses saved"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving poses");
    });
});

server.listen(config.PORT, () => {
  console.log(`server listening on port ${config.PORT}`);
});
