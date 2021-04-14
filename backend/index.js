const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/test", (req, res) => {
  res.json({ test: "okay" });
});

app.post("/training", (req, res) => {
  console.log("HEADERS", req.headers);
  console.log("BODY", req.body);
  // fs.WriteFileSync("asd.json", {asd})
  res.status(200).send();
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
