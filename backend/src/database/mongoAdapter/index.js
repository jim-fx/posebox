import pkg from "mongodb";
import * as config from "../../config/index.js";
import * as localAdapter from "../localAdapter/index.js";
const { MongoClient } = pkg;

const client = new MongoClient(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * @type Promise<{ [key:string]: pkg.Collection }>
 */
const db = new Promise((res, rej) => {
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

async function addTrainingPose(pose) {
  const { poses } = await db;

  if (Array.isArray(pose)) {
    await poses.insertMany(pose);
  } else {
    await poses.insertOne(pose);
  }

  return poses.save();
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

(async () => {
  const poses = await getAllPoses();

  if (!poses.length) {
    await addPoses(await localAdapter.getAllPoses());
  }
})();

export {
  addTrainingPose,
  getAllTrainingPoses,
  getTrainingPosesByID,
  getAllPoses,
  addPose,
};
