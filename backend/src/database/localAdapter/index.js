import { readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const db = {
  training: createDB("trainingData"),
  poses: createDB("poses"),
};

async function addTrainingPose(pose) {
  const poses = await db.training;

  if (Array.isArray(pose)) {
    poses.data.push(...pose);
  } else {
    poses.data.push(pose);
  }

  return poses.save();
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

export {
  addTrainingPose,
  getAllTrainingPoses,
  getTrainingPosesByID,
  getAllPoses,
  addPose,
};
