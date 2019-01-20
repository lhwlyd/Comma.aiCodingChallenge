import mongoose from "mongoose";
var GeoJSON = require("mongoose-geojson-schema");
const Schema = mongoose.Schema;
require("mongoose-double")(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const PointSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number], // lat, longi
    required: true
  },
  speed: {
    type: SchemaTypes.Double,
    required: true
  },
  distance: {
    type: SchemaTypes.Double,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});
// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const RoutesSchema = new Schema(
  {
    start_time: Date,
    data: [PointSchema],
    end_time: Date
  },
  { timestamps: true }
);

let Routes = mongoose.model("Routes", RoutesSchema);
let Points = mongoose.model("Points", PointSchema);
// export our module to use in server.js
export { Routes, Points };
