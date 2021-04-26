#!/usr/bin/env node
const [, , action, ...args] = process.argv;
const path = require("path");
const fs = require("fs/promises");
const fetch = require("node-fetch");
const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error(
    "You need to provide a MONGO_URL environment variable with a mongodb connection string"
  );
}

const poseDB = new Promise((res, rej) => {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err) => {
    if (err) {
      return rej(err);
    } else {
      console.log("[DB-mongo] connected");
    }

    res(client.db("training").collection("poses"));
  });
});

if (action === "push") {
  const filePath = path.resolve(process.cwd(), args[0]);

  (async () => {
    const file = await fs.readFile(filePath, "utf-8");

    let poses;
    try {
      poses = JSON.parse(file);
    } catch (error) {
      console.error(err);
    }

    const groupSize = 10;
    const groups = [];

    poses.forEach((pose, i) => {
      const index = Math.floor(i / groupSize);
      if (groups[index]) {
        groups[index].push(pose);
      } else {
        groups[index] = [pose];
      }
    });

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      console.log("Pushing group (" + i + "/" + groups.length + ")");

      await (await poseDB).insertMany(group);

      console.log(Math.floor((i / (groups.length - 1)) * 100) + "%");
    }

    console.log("Finished");
    process.exit(0);
  })();
}
