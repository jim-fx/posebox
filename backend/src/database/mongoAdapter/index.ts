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

async function addTrainingPose(pose) {
  const { poses } = await db;

  if (Array.isArray(pose)) {
    return await poses.insertMany(pose);
  } else {
    return await poses.insertOne(pose);
  }
}

async function getAllTrainingPoses() {
  return (await db).trainingCleaned.find({}).toArray();
}

async function getTrainingPosesByID(id) {
  return (await db).trainingCleaned.find({ id }).toArray();
}

async function getAllPoses() {
  return (await db).poses.find({}).toArray();
}

async function addPose(pose) {
  return (await db).poses.insertOne(pose);
}

async function addPoses(poses) {
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
      }

      res({
        trainingRaw: client.db("training").collection("raw"),
        trainingCleaned: client.db("training").collection("clean"),
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
