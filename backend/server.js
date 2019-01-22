// server.js

// first we import our dependencies…
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";

// server.js
import { getSecret } from "./secrets";
import { Routes } from "./models/Route";
const path = require("path");
// ... removed for brevity
const API_PORT = process.env.PORT || 3001;

// db config -- set your URI from mLab in secrets.js
mongoose.connect(
  getSecret("dbUri"),
  { useNewUrlParser: true }
);
var db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// other routes and stuff
mongoose.Promise = global.Promise;
// and create our instances
const app = express();
app.use(express.urlencoded({ limit: "400mb", extended: true }));
app.use(express.json({ limit: "400mb", extended: true }));
app.use(express.static(path.join(__dirname, "client", "build")));

// API routes
require("./routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

module.exports = app;
