import express, { Router } from "express";
import brain from "../brain";

const router = Router();

router.use("/model", express.static("./brain/weights"));

router.get("/info", async (req, res) => {
  res.json(await brain.getInfo());
});

router.get("/iterations", (req, res) => {
  res.json(brain.getIterations());
});

router.post("/reset", (req, res) => {
  res.json(brain.reset());
});

router.get("/weights", async (req, res) => {
  res.json(await brain.getWeights());
});

export default router;
