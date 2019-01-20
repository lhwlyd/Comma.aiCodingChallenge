// @flow

import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UploadRoute from "../UploadRoute.js";
import Map from "../Map.js";

export default class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Map} />
          <Route exact path="/upload" component={UploadRoute} />
        </Switch>
      </BrowserRouter>
    );
  }
}
