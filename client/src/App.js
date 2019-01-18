import React, { Component } from 'react';
import 'whatwg-fetch';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.loadRoutesFromServer();
  }

  loadRoutesFromServer = () => {
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch('/api/routes/fetchall').then((res) => {
      console.log(res);
    });
  };

  render() {
    return <div className="container">{this.state.error && <p>{this.state.error}</p>}</div>;
  }
}

export default App; // Don’t forget to use export default!
