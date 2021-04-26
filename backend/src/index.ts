import express from "express";
import { createServer } from "http";
import * as config from "./config";
import db from "./database";
import * as middleware from "./middleware";
import * as routes from "./routes";
import socket from "./socket-server";

const app = express();
const server = createServer(app);

socket.connectTo(server);

app.use(express.json());

app.use(express.static("../frontend/public"));

app.get("/poses", async (req, res) => {
  res.json(await db.getAllPoses());
});

app.use("/brain", routes.brain);

app.use("/admin", middleware.adminAuth, express.static("../admin/public"));
app.use("/admin", middleware.adminAuth, routes.admin);

app.use("/data", routes.data);

server.listen(config.PORT, () => {
  console.log(`server listening on port ${config.PORT}`);
});
