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

router.get("/training/:poseId?", async (req, res) => {
  // "?amount=100&kevin=schlomeple"

  // "0, 10, "

  //short-circuting

  const { poseId } = req.params;

  let { amount = 100, verified, offset = 0 } = req.query as {
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

  res.json(await db.getTrainingPoses({ amount, offset, verified, id: poseId }));
});

router.post("/verify", async (req, res) => {
  const body = req.body;

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

    const verified = total.filter(
      (pose) => typeof pose.verified !== "undefined"
    );

    const accepted = total.filter((pose) => pose.verified);

    res.json({
      totalAmount: total.length,
      verifiedAmount: verified.length,
      accepted: accepted.length / total.length,
      verified: verified.length / total.length,
    });
  } else {
    const total = await db.getAllTrainingPoses();

    const verified = total.filter(
      (pose) => typeof pose.verified !== "undefined"
    );

    const accepted = total.filter((pose) => pose.verified);

    const amount = {};
    const posesVerified = {};
    const posesAccepted = {};
    total.forEach((v) => {
      amount[v.id] = v.id in amount ? amount[v.id] + 1 : 1;

      if (typeof v.verified !== "undefined") {
        posesVerified[v.id] =
          v.id in posesVerified ? posesVerified[v.id] + 1 : 1;
      }

      if (v.verified) {
        posesAccepted[v.id] =
          v.id in posesAccepted ? posesAccepted[v.id] + 1 : 0;
      }
    });

    Object.keys(amount).forEach((key) => {
      posesVerified[key] =
        key in posesVerified ? posesVerified[key] / amount[key] : 0;
      posesAccepted[key] =
        key in posesAccepted ? posesAccepted[key] / amount[key] : 0;
    });

    res.json({
      totalAmount: total.length,
      totalAccepted: accepted.length / total.length,
      totalVerified: verified.length / total.length,
      amount,
      accepted: posesAccepted,
      verified: posesVerified,
    });
  }
});

export default router;
