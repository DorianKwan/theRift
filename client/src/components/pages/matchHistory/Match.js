import React, {Component} from "react";
import "./match.scss";

export default class Match extends Component {
  constructor(props) {
    super(props);
  }

  findDesiredSummoner(players, summonerName) {
    let summoner;

    for (let key in players) {
      if (players[key].name == summonerName.replace(/[.]/g, " ")) {
        summoner = players[key];
      }
    }

    return summoner;
  }

  determineGameResult(matchData, summonerTeam) {
    const team = summonerTeam === 100 ? "Blue" : "Red";
    const result = team === matchData.winningTeam ? "Victory" : "Defeat";
    return result;
  }

  renderMatchContent() {
    const { matchData, summoner } = this.props;
    const { gameDuration, players } = matchData;
    const desiredSummoner = this.findDesiredSummoner(players, summoner);

    if (!desiredSummoner) return ("");

    const { build, stats, team, champion } = desiredSummoner;
    const gameResult = this.determineGameResult(matchData, team);
    const multiKill = stats.score.highestMultiKill ? stats.score.highestMultiKill : "";
    const matchClasses = gameResult === "Defeat" ? "match match-loss" : " match match-won";

    return (
      <div className={matchClasses}>
        <div className="game-result">
          <div className={gameResult.toLowerCase()}>
            <h2>{gameResult}</h2>
          </div>
          <hr />
          <div>
            {gameDuration}
          </div>
        </div>
        <div className="summoner-selection">
          <div className="champion">
            <h4>Champion:</h4>
            <p>{champion}</p>
          </div>
          <div className="summoner-spells">
            <h4>Summoner Spells:</h4>
            <div>
              <p>{build.summonerSpells.one}</p>
              <p>{build.summonerSpells.two}</p>
            </div>
          </div>
          <div className="runes">
            <h4>Runes:</h4>
            <div>
              <p>{build.runes.primary}</p>
              <p>{build.runes.secondary}</p>
            </div>
          </div>
        </div>
        <div className="summoner-data">
          <h4>In Game Stats:</h4>
          <div>
            <p>{stats.score.kills}/{stats.score.deaths}/{stats.score.assists}</p>
            <p>{stats.score.kda}:1 KDA</p>
          </div>
          <div>
            <p>Highest Multikill: <b>{multiKill}</b></p>
          </div>
          <div>
            <p>Level {stats.championLevel}</p>
            <p>{stats.score.creepScore} ({(stats.score.creepScore / (matchData.gameTime / 60)).toFixed(2)}) CS</p>
          </div>
        </div>
        <div className="items">
          <div className="item-column">
            <div className="item-label">Item 1</div>
            <p>{build.items.item0}</p>
            <div className="item-label">Item 2</div>
            <p>{build.items.item1}</p>
          </div>
          <div className="item-column">
            <div className="item-label">Item 3</div>
            <p>{build.items.item2}</p>
            <div className="item-label">Item 4</div>
            <p>{build.items.item3}</p>
          </div>
          <div className="item-column">
            <div className="item-label">Item 5</div>
            <p>{build.items.item4}</p>
            <div className="item-label">Item 6</div>
            <p>{build.items.item5}</p>
          </div>
        </div>
        <div className="trinket-and-wards">
          <p>{build.items.item6}</p>
          <p>{stats.score.pinkWards} Control Wards</p>
        </div>
        <div className="player-names">
          <h4>Players</h4>
          <div class="players">
            <div>
              <p>{matchData.players["1"].name}</p>
              <p>{matchData.players["2"].name}</p>
              <p>{matchData.players["3"].name}</p>
              <p>{matchData.players["4"].name}</p>
              <p>{matchData.players["5"].name}</p>
            </div>
            <div>
              <p>{matchData.players["6"].name}</p>
              <p>{matchData.players["7"].name}</p>
              <p>{matchData.players["8"].name}</p>
              <p>{matchData.players["9"].name}</p>
              <p>{matchData.players["10"].name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const matchContent = this.renderMatchContent();

    return matchContent;
  }
}
