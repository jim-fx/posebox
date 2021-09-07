import {
  DBPaginationOptions,
  DBUpdateOption,
  DBUpdateOptions,
  Pose,
} from "@poser/types";
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
    save: () => {
      const content = JSON.stringify(data);
      if (content.length < 5) return;
      return writeFile(path, content, {
        encoding: "utf-8",
      });
    },
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
  id,
}: DBPaginationOptions): Promise<Pose[]> {
  let poses = (await db.training).data;

  if (typeof verified !== "undefined") {
    if (verified === null) {
      verified = undefined;
    }
    poses = poses.filter((v) => v.verified === verified);
  }

  if (typeof id === "string" && id.length) {
    poses = poses.filter((v) => v.id === id);
  }

  return poses.slice(offset, offset + amount);
}

async function getAllTrainingPoses() {
  return (await db.training).data;
}

async function getVerifiedTrainingPoses() {
  return (await db.training).data.filter((pose) => pose.verified);
}

async function getTrainingPosesByID(id) {
  return (await db.training).data.filter((pose) => pose.id === id);
}

async function getAllPoses() {
  return (await db.poses).data;
}

async function getPoseById(poseId: string) {
  return (await db.poses).data.find((p) => p.id === poseId);
}

async function updateSingleTrainingPose(updateOptions: DBUpdateOption) {
  const data = (await db.training).data;

  let value = data.find((v) => v._id === updateOptions.id);
  Object.entries(updateOptions.updates).forEach(([key, v]) => {
    value[key] = v;
  });
}

async function updateTrainingPoses(updates: DBUpdateOptions) {
  await Promise.all(updates.map((up) => updateSingleTrainingPose(up)));
  return (await db.training).save();
}

async function addPose(pose) {
  (await db.poses).data.push(pose);
  return (await db.poses).save();
}

async function deletePose(poseId: string) {
  const poses = await db.poses;
  poses.data = poses.data.filter((p) => p.id !== poseId);
  return (await db.poses).save();
}

async function updatePose(poseId: string, update: Partial<Pose>) {
  const poses = await db.poses;

  const pose = poses.data.find((pose) => pose.id === poseId);

  if (pose) {
    Object.keys(update).forEach((key) => {
      pose[key] = update[key];
    });
  }

  return poses.save();
}

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
    getTrainingPoses,
    getTrainingPosesByID,
    getVerifiedTrainingPoses,
    updateSingleTrainingPose,
    updateTrainingPoses,

    getAllPoses,
    getPoseById,
    addPose,
    deletePose,
    updatePose,
  };
};
