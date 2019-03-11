import React, {Component} from "react";
import Match from "./matchHistory/Match";
import "./matchHistory.scss";

export default class MatchHistory extends Component {
  render() {
    return (
    <div>
      <h1>The Rift App</h1>
      <Match />
    </div>
    );
  }
}