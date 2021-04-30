import express, { Router } from "express";
import brain from "../brain";
import { resolve } from "path";

const router = Router();

//router.use("/model", express.static(resolve(__dirname, "./brain/weights")));

router.get("/model/model.json", (req, res) => {
  res.sendFile(resolve(__dirname, "../brain/weights/model.json"));
})
router.get("/model/weights.bin", (req, res) => {
  res.sendFile(resolve(__dirname, "../brain/weights/weights.bin"));
})

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
