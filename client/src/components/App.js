import React, {Component} from "react";
import "./app.scss"
import MatchHistory from "./pages/MatchHistory";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.connectServer = this.connectServer.bind(this);
  }

  connectServer() {
    fetch("/");
  }

  componentDidMount() {
    this.connectServer();
  }

  render() {
    return (
    <div>
      <MatchHistory />
    </div>
    );
  }
}
