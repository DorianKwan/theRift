import React, {Component} from "react";
import Match from "./matchHistory/Match";
import "./matchHistory.scss";

export default class MatchHistory extends Component {
  constructor(props) {
    super(props);
  }

  renderMatch(matchData, matchKey) {
    return (
      <Match key={matchKey} matchData={matchData} summoner={this.props.summoner} />
    );
  }

  renderMatches() {
    let matches = [];

    for (let matchKey in this.props.matches.matchHistory) {
      matches.push(this.renderMatch(this.props.matches.matchHistory[matchKey], matchKey));
    }

     return (
      matches
     ); 
  }

  render() {
    const matches = this.props.matches ? this.renderMatches() : "";

    return (
    <div className="matches">
      {matches}
    </div>
    );
  }
}
