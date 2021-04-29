import { Router } from "express";
import db from "../database";

const router = Router();

router.post("/", (req, res) => {
  db.addTrainingPose(req.body)
    .then(() => res.status(200).send("Poses saved"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving poses");
    });
});

router.get("/training", async (req, res) => {
  let amount = Math.min(100, parseInt(req.query.amount as string)) || 100;
  const offset = parseInt(req.query.offset as string) || 100;
  const verified = req.query.verified as any;

  res.json(await db.getTrainingPoses({ amount, offset, verified }));
});

export default router;
