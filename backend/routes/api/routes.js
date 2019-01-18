const { Routes, Points } = require("../../models/Route");
module.exports = app => {
  /* Fetch all routes */
  app.post("/api/routes/fetchall", (req, res, next) => {
    Route.find({}, function(err, routes) {
      res.send(routes);
    });
  });

  /* post a new route */
  app.post("/api/routes/postRoute", (req, res, next) => {
    const route = new Routes();
    const { points, date } = req.body;
    points.map(item => {
      let newPoint = new Points();

      newPoint.coordinates = [item.lat, item.lng];
      newPoint.speed = item.speed;
      newPoint.distance = item.dist;
      newPoint.index = item.index;

      route.data.push(newPoint);
    });

    route.save((err, event) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error when creating new route"
        });
      }
      return res.send({
        success: true,
        message: "Created route"
      });
    });
  });
};
