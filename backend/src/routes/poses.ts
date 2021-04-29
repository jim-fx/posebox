import { Router } from "express";
import db from "../database";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await db.getAllPoses());
});

router.get("/:poseId", async (req, res) => {
  const { poseId } = req.params;

  if (poseId.length) {
    res.json(await db.getPoseById(poseId));
  } else {
    res.status(404).send();
  }
});

router.put("/:poseId", async (req, res) => {
  const { poseId } = req.params;

  if (poseId.length) {
    res.json(await db.updatePose(poseId, req.body));
  } else {
    res.status(404).send();
  }
});

export default router;
