import React, {Component} from "react";
import "./match.scss";

export default class Match extends Component {
  constructor(props) {
    super(props);
  }

  findDesiredSummoner(players, summonerName) {
    let summoner;

    for (let key in players) {
      if (players[key].name === summonerName) {
        summoner = players[key];
      }
    }

    return summoner;
  }

  determineGameResult(matchData, summonerTeam) {
    const team   = summonerTeam === 100 ? "Blue" : "Red";
    const result = team === matchData.winningTeam ? "Victory" : "Defeat";
    return result;
  }

  renderMatchContent() {
    const { matchData, summoner }   = this.props;
    const { gameDuration, players } = matchData;
    const desiredSummoner           = this.findDesiredSummoner(players, summoner);
    const { build, stats, team, champion } = desiredSummoner;
    const gameResult   = this.determineGameResult(matchData, team);
    const multiKill    = stats.score.highestMultiKill ? stats.score.highestMultiKill : "";
    const matchClasses = gameResult === "Defeat" ? "columns match match-loss" : "columns match match-won";

    return (
      <div className={matchClasses}>
        <div className="column is-1">
          <div className={gameResult.toLowerCase()}>
            {gameResult}
          </div>
          <hr />
          <div>
            {gameDuration}
          </div>
        </div>
        <div className="columns column is-3">
          <div className="column">
            <div>Summoner Spells:</div>
            <div>{build.summonerSpells.one}</div>
            <div>{build.summonerSpells.two}</div>
          </div>
          <div className="column">
            <div>Champion:</div>
            <div>{champion}</div>
          </div>
          <div className="column">
            <div>Runes:</div>
            <div>{build.runes.primary}</div>
            <div>{build.runes.secondary}</div>
          </div>
        </div>
        <div className="column is-1">
          <p>{stats.score.kills}/{stats.score.deaths}/{stats.score.assists}</p>
          <p>{stats.score.kda}:1 KDA</p>
          <p>{multiKill}</p>
        </div>
        <div className="column is-1">
          <p>Level {stats.championLevel}</p>
          <p>{stats.score.creepScore} ({(stats.score.creepScore / (matchData.gameTime / 60)).toFixed(2)}) CS</p>
        </div>
        <div className="columns column is-3">
          <div className="column">
              <div>Item 1</div>
              <div>{build.items.item0}</div>
              <div>Item 2</div>
              <div>{build.items.item1}</div>
            </div>
            <div className="column">
              <div>Item 3</div>
              <div>{build.items.item2}</div>
              <div>Item 4</div>
              <div>{build.items.item3}</div>
            </div>
            <div className="column">
              <div>Item 5</div>
              <div>{build.items.item4}</div>
              <div>Item 6</div>
              <div>{build.items.item5}</div>
            </div>
        </div>
        <div className="column is-1">
          <div>{build.items.item6}</div>
          <div>{stats.score.pinkWards} Control Wards</div>
        </div>
        <div className="column is-1">
          <p>{matchData.players["1"].name}</p>
          <p>{matchData.players["2"].name}</p>
          <p>{matchData.players["3"].name}</p>
          <p>{matchData.players["4"].name}</p>
          <p>{matchData.players["5"].name}</p>
        </div>
        <div className="column is-1">
          <p>{matchData.players["6"].name}</p>
          <p>{matchData.players["7"].name}</p>
          <p>{matchData.players["8"].name}</p>
          <p>{matchData.players["9"].name}</p>
          <p>{matchData.players["10"].name}</p>
        </div>
      </div>
    );
  }

  render() {
    const matchContent = this.renderMatchContent();

    return (
      <div className="match">
        {matchContent}    
      </div>
    );
  }
}
