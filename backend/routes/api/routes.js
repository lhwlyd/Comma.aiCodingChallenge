const { Routes, Points } = require("../../models/Route");

module.exports = app => {
  /* Fetch all routes */
  app.post("/api/routes/fetchall", (req, res, next) => {
    Routes.find({}, function(err, routes) {
      res.send(routes);
    });
  });

  /* Fetch the first route */
  app.post("/api/routes/fetchfirst", (req, res, next) => {
    Routes.findOne()
      .sort({ start_time: -1 })
      .exec(function(err, route) {
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

    console.log(points);
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
      console.log(route);
      return res.send({
        success: true,
        message: "Created route"
      });
    });
  });
};
