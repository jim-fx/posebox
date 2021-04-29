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
  // "?amount=100&kevin=schlomeple"

  // "0, 10, "

  //short-circuting

  let { amount = 100, verified, offset = 0, id } = req.query as {
    [key: string]: any;
  };

  amount = Math.min(100, parseInt(amount));
  offset = parseInt(offset);

  if (typeof verified === "string") {
    if (verified === "true") {
      verified = true;
    } else if (verified === "false") {
      verified = false;
    } else if (verified === "null") {
      verified = null;
    }
  }

  res.json(await db.getTrainingPoses({ amount, offset, verified, id }));
});

router.post("/verify", async (req, res) => {
  const body = req.body;

  console.log(body);

  const updates = body
    .map((v) => {
      if (
        "id" in v &&
        "verified" in v &&
        typeof v.id === "string" &&
        typeof v.verified === "boolean"
      ) {
        return {
          id: v.id,
          updates: {
            verified: v.verified,
          },
        };
      }
      return false;
    })
    .filter((v) => !!v);

  console.log("Updates", updates);

  await db.updateTrainingPoses(updates);

  res.status(200).send();
});

router.get("/status/:poseId?", async (req, res) => {
  const { poseId } = req.params;

  if (poseId) {
    const total = await db.getTrainingPosesByID(poseId);

    const verified = await db.getTrainingPoses({
      amount: 10000,
      offset: 0,
      id: poseId,
      verified: true,
    });

    res.json({
      totalAmount: total.length,
      verifiedAmount: verified.length,
      verifiedPercent: verified.length / total.length,
    });
  } else {
    const total = await db.getAllTrainingPoses();

    const verified = await db.getTrainingPoses({
      amount: 10000,
      offset: 0,
      verified: true,
    });

    const verifiedAmount = verified.length / total.length;

    const amountVerified = {};
    const amount = {};
    total.forEach((v) => {
      amount[v.id] = v.id in amount ? amount[v.id] + 1 : 1;
      if (amountVerified[v.id] && v.verified) {
        amountVerified[v.id] += 1;
      } else if (v.verified) {
        amountVerified[v.id] = 1;
      }
    });

    const percentVerified = {};
    Object.keys(amount).forEach((key) => {
      if (key in amountVerified) {
        percentVerified[key] = amountVerified[key] / amount[key];
      } else {
        percentVerified[key] = 0;
      }
    });

    res.json({
      totalAmount: total.length,
      verifiedAmount,
      amount,
      percentVerified,
    });
  }
});

export default router;
