// server.js

// first we import our dependencies…
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";

// server.js
import { Routes } from "./models/Route";
const path = require("path");
// ... removed for brevity
//const API_PORT = process.env.PORT || 3001;
const server_port = process.env.PORT || 3001;
const server_host = 3001 || "0.0.0.0";

// db config -- set your URI from mLab in secrets.js
mongoose.connect(
  "mongodb://lhwlyd:LhwLyd12@practice-shard-00-00-nmjo9.azure.mongodb.net:27017,practice-shard-00-01-nmjo9.azure.mongodb.net:27017,practice-shard-00-02-nmjo9.azure.mongodb.net:27017/test?ssl=true&replicaSet=Practice-shard-0&authSource=admin&retryWrites=true",
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

app.listen(server_port, server_host, function() {
  console.log("Listening on port %d", server_port);
});
module.exports = app;
