import express from "express";
import { createServer } from "http";
import * as config from "./config";
import db from "./database";
import * as routes from "./routes";
import socket from "./socket-server";

const app = express();
const server = createServer(app);

socket.connectTo(server);

app.use(express.static("../frontend/public"));

app.use(express.json());

app.get("/poses", async (req, res) => {
  res.json(await db.getAllPoses());
});

app.use("/brain", routes.brain);

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
