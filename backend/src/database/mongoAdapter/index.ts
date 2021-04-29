import type { DBPaginationOptions, Pose } from "@poser/types";
import { Collection, MongoClient } from "mongodb";
import * as config from "../../config";
import localAdapter from "../localAdapter";

let db: Promise<{
  [key: string]: Collection;
  training: Collection<Pose>;
}>;

async function addTrainingPose(pose: Pose | Pose[]) {
  const { training } = await db;

  let data = Array.isArray(pose) ? pose : [pose];

  console.log("[DB] Adding " + data.length + " new Poses");

  return await training.insertMany(data);
}

async function getAllTrainingPoses(): Promise<Pose[]> {
  return (await db).training.find().toArray();
}

async function getTrainingPosesByID(id): Promise<Pose[]> {
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

async function getTrainingPoses({
  amount = 100,
  offset = 0,
  verified,
}: DBPaginationOptions): Promise<Pose[]> {
  return (await db).training
    .aggregate(
      [
        typeof verified !== "undefined" && { $match: { verified } },
        { $skip: offset },
        { $limit: amount },
      ].filter((v) => !!v)
    )
    .toArray();
}

async function initData() {
  const poses = await getAllPoses();

  if (!poses.length) {
    await addPoses(await localAdapter().getAllPoses());
  }
}

export default () => {
  const client = new MongoClient(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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
    getTrainingPoses,
    getTrainingPosesByID,
    getAllPoses,
    addPose,
  };
};
