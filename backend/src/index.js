import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { addTrainingPose, getAllPoses } from "./database/index.js";
import { connectSocketServer } from "./socket-server.js";

const app = express();
const server = http.createServer(app);
connectSocketServer(server);

app.use(express.static("../frontend/public"));

app.use(bodyParser.json());

app.get("/poses", async (req, res) => {
  const poses = await getAllPoses();
  res.json(poses);
});

app.post("/trainingData", (req, res) => {
  addTrainingPose(req.body)
    .then(() => res.status(200).send("Poses saved"))
    .catch((err) => {console.log(err); res.status(500).send("Error saving poses")});
});

server.listen(8080, () => {
  console.log("server listening on port 8080");
});
