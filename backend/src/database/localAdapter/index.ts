import { DBPaginationOptions, Pose } from "@poser/types";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";

const createDB = async (fileName) => {
  const path = resolve(__dirname + `/data/${fileName}.json`);
  let data = [];
  try {
    const file = await readFile(path, "utf-8");
    data = JSON.parse(file);
  } catch (error) {}

  return {
    data,
    save: () =>
      writeFile(path, JSON.stringify(data), {
        encoding: "utf-8",
      }),
  };
};

let db: { [key: string]: ReturnType<typeof createDB> };

async function addTrainingPose(pose) {
  const poses = await db.training;

  let data = Array.isArray(pose) ? pose : [pose];

  data = data.map((pose) => {
    pose._id = uuidv4();
    return pose;
  });

  poses.data.push(...pose);

  return poses.save();
}

async function getTrainingPoses({
  amount = 100,
  offset = 0,
  verified,
}: DBPaginationOptions): Promise<Pose[]> {
  let poses = (await db.training).data;

  if (typeof verified !== "undefined") {
    if (verified === null) {
      verified = undefined;
    }
    poses = poses.filter((v) => v.verified === verified);
  }

  return poses.slice(offset, offset + amount);
}

async function getAllTrainingPoses() {
  return (await db.training).data;
}

async function getTrainingPosesByID(id) {
  return (await db.training).data.filter((pose) => pose.id === id);
}

async function getAllPoses() {
  return (await db.poses).data;
}

async function addPose(pose) {}

async function init() {
  const training = await db.training;

  training.data.forEach((d) => {
    if (!("_id" in d)) {
      d._id = uuidv4();
    }
  });

  await training.save();
}

export default () => {
  db = {
    training: createDB("trainingData"),
    poses: createDB("poses"),
  };

  init();

  console.log("[DB-local] initialized");

  return {
    addTrainingPose,
    getAllTrainingPoses,
    getTrainingPosesByID,
    getTrainingPoses,
    getAllPoses,
    addPose,
  };
};
