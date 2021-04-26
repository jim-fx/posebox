import type { Pose } from "@poser/types";
import pkg from "mongodb";
import * as config from "../../config";
import localAdapter from "../localAdapter";
const { MongoClient } = pkg;

const client = new MongoClient(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * @type Promise<{ [key:string]: pkg.Collection }>
 */
let db;

async function addTrainingPose(pose: Pose | Pose[]) {
  const { training } = await db;

  let data = Array.isArray(pose) ? pose : [pose];

  data = data.map((pose) => {
    pose.verified = false;
    return pose;
  });

  console.log("[DB] Adding " + data.length + " new Poses");

  return await training.insertMany(pose);
}

async function getAllTrainingPoses(): Promise<Pose[]> {
  return (await db).training.find({ verified: true }).toArray();
}

async function getTrainingPosesByID(id): Promise<Pose> {
  return (await db).training.find({ id }).toArray();
}

async function getAllPoses(): Promise<Pose[]> {
  return (await db).poses.find({}).toArray();
}

async function addPose(pose: Pose) {
  return (await db).poses.insertOne(pose);
}

async function addPoses(poses: Pose[]) {
  return (await db).poses.insertMany(poses);
}

async function initData() {
  const poses = await getAllPoses();

  if (!poses.length) {
    await addPoses(await localAdapter().getAllPoses());
  }
}

export default () => {
  db = new Promise((res, rej) => {
    client.connect((err) => {
      if (err) {
        return rej(err);
      } else {
        console.log("[DB-mongo] connected");
      }

      res({
        training: client.db("training").collection("poses"),
        poses: client.db("poses").collection("main"),
      });
    });
  });

  initData();

  return {
    addTrainingPose,
    getAllTrainingPoses,
    getTrainingPosesByID,
    getAllPoses,
    addPose,
  };
};
