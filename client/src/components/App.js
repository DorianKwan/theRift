import React, {Component} from "react";
import "./app.scss"
import MatchHistory from "./pages/MatchHistory";

export default class App extends Component {
  render() {
    return (
    <div>
      <MatchHistory />
    </div>
    );
  }
}
