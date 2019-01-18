const fs = require("fs");
import { getSecret } from "../backend/secrets";

// db config -- set your URI from mLab in secrets.js
mongoose.connect(getSecret("dbUri"));
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

fs.readdir("./trips/", (err, items) => {
  if (err) throw err;
  for (let i = 0; i < items.length; i++) {
    let path = "./trips/" + items[i];
    let rawdata = fs.readFile(path, (err, rawdata) => {
      if (err) throw err;
      let data = JSON.parse(rawdata);
    });
  }
});
