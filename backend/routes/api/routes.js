const { Routes, Points } = require("../../models/Route");

module.exports = app => {
  /* Fetch all routes */
  app.post("/api/routes/fetchall", (req, res, next) => {
    Route.find({}, function(err, routes) {
      res.send(routes);
    });
  });

  /* post a new SINGLE route */
  app.post("/api/routes/postRoute", (req, res, next) => {
    const route = new Routes();
    const data = req.body;
    route.start_time = Date(data.start_time);
    route.end_time = Date(data.end_time);

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

    // points.map(item => {
    //   let newPoint = new Points();
    //
    //   newPoint.coordinates = [item.lat, item.lng];
    //   newPoint.speed = item.speed;
    //   newPoint.distance = item.dist;
    //   newPoint.index = item.index;
    //
    //   route.data.push(newPoint);
    // });

    // route.save((err, event) => {
    //   if (err) {
    //     return res.send({
    //       success: false,
    //       message: "Error: Server error when creating new route"
    //     });
    //   }
    //   return res.send({
    //     success: true,
    //     message: "Created route"
    //   });
    // });
  });
};
