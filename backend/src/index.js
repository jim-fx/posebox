import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { connectSocketServer } from "./socket-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
connectSocketServer(server);

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

app.post("/trainingData/:id", (req, res) => {
  //console.log("HEADERS", req.headers);
  //console.log(req.params);
  fs.writeFileSync("./src/data/trainingData.json", JSON.stringify(req.body), {
    encoding: "utf8",
    flag: "a+",
    mode: 0o666,
  });
  res.status(200).send();
});

server.listen(8080, () => {
  console.log("server listening on port 8080");
});
