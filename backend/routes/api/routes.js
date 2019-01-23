const { Routes, Points, _Routes_Ids } = require("../../models/Route");
const mongoose = require("mongoose");

module.exports = app => {
  /* Fetch all routes */
  app.post("/api/routes/fetchall", (req, res, next) => {
    Routes.find({}, function(err, routes) {
      if (err) throw err;
      res.send(routes);
    });
  });

  /* Fetch all the ids in the db */
  app.post("/api/routes/fetchids", (req, res, next) => {
    console.log("fetching ids..");
    _Routes_Ids.find({}, function(err, routesIds) {
      if (err) throw err;
      let ids = routesIds.map(routeId => routeId.routeId);
      res.send(ids);
    });
    console.log("finished fetching ids!");
  });

  /* DO NOT USE THIS Create a collection of existing ids, dev only */
  app.post("/api/routes/_create_ids_dev", (req, res, next) => {
    console.log("creating ids collection..");
    Routes.find({}, function(err, routes) {
      if (err) throw err;
      routes.forEach(route => {
        let id = new _Routes_Ids();
        id.routeId = route._id;
        id.save((err, event) => {
          if (err) throw err;
        });
      });

      console.log("ids collection created");
    });
  });

  /* Fetch one route with id */
  app.post("/api/routes/fetchone", (req, res, next) => {
    const { body } = req;
    const { id } = body;
    Routes.findById(id, "data start_time", function(err, route) {
      if (err) {
        throw err;
        return res.send({
          success: false,
          message: "Error: " + err
        });
      }
      return res.send(route);
    });
  });

  /* Fetch a random? route, for dev only */
  app.post("/api/routes/fetchfirst", (req, res, next) => {
    Routes.findOne().exec(function(err, route) {
      if (err) throw err;
      res.send(route);
    });
  });

  /* post a new SINGLE route */
  app.post("/api/routes/postRoute", (req, res, next) => {
    const route = new Routes();
    const data = req.body;

    const coords = data.coords;
    let points = [];
    for (let i = 0; i < coords.length; i++) {
      let point = new Points();
      let coord = coords[i];
      point.coordinates = [parseFloat(coord.lat), parseFloat(coord.lng)];
      point.speed = parseFloat(coord.speed);
      point.distance = parseFloat(coord.dist);
      point.index = Number(coord.index);

      points.push(point);
    }

    route.start_time = data.start_time;
    route.end_time = data.end_time;
    route.data = points;

    route.save((err, event) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: creating new route"
        });
      }
      return res.send({
        success: true,
        message: "Created route"
      });
    });
  });
};
