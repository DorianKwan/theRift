const axios = require("axios");
const runes = require("../staticGameData/runesReforged");
const items = require("../staticGameData/item");
const champions = require("../staticGameData/champion");
const summoners = require("../staticGameData/summoner");

API_URL = "https://na1.api.riotgames.com/";
API_KEY = process.env.API_KEY;
SUMMONERS_PATH = "lol/summoner/v4/summoners/by-name/";
MATCH_HISTORY_PATH = "lol/match/v4/matchlists/by-account/";
MATCH_OUTCOME_PATH = "lol/match/v4/matches/";

/***** Public Service Methods *****/

const RiotGamesAPI = {
  getMatchHistory: async (summonerName) => {
    const summonerData = await getSummonerData(summonerName);
    const matchHistoryIds = await getMatchHistoryIds(summonerData.accountId);
    const matchHistory = await buildMatchHistory(matchHistoryIds)
    return { matchHistory, summonerName: summonerData["name"] };
  }
}

/***** Riot Games API Request Methods *****/

// Basic API request method
const sendApiRequest = async (path, requestData) => {
  const key = `?api_key=${API_KEY}`;
  return await axios.get(`${API_URL}${path}${requestData}${key}`)
    .then((response) => {
      return response.data;
    }).catch((error) => {
      throw error;
    });
}

// Request for basic summoner data (important data is the account ID)
const getSummonerData = async (summonerName) => {
  return await sendApiRequest(SUMMONERS_PATH, summonerName);
}

// Request for a summoners match history (returns match ids)
const getMatchHistoryIds = async (accountId) => {
  const responseData = await sendApiRequest(MATCH_HISTORY_PATH, accountId);
  return responseData.matches;
}

// Request for match data (returns highly modified data to suit front-end needs)
const getMatchData = async (matchId) => {
  const responseData = await sendApiRequest(MATCH_OUTCOME_PATH, matchId);
  const summonersInfo = pullSummonersInfo(responseData);
  const summonersData = pullSummonersData(responseData, summonersInfo);
  const match = buildMatch(responseData, summonersData);
  return match;
}

/***** Data builder methods *****/

const buildMatchHistory = async (matchHistoryIds) => {
  let matchHistory = {};
  let gameNumber = 1;

  for (let match of matchHistoryIds.slice(0, 6)) {
    const matchData = await getMatchData(match["gameId"]);;
    matchHistory[gameNumber] = matchData
    gameNumber++;
  }

  return matchHistory;
}

const buildMatch = (gameData, summonersData) => {
  const gameDuration = calcGameDuration(gameData);
  const gameTime = gameData["gameDuration"];
  const winningTeam = summonersData["1"].stats.win ? "Blue" : "Red";
  let match = {
    gameDuration,
    gameTime,
    winningTeam, 
    players: summonersData
  }

  return match;
}

const buildSummonerItemBuild = (playerData) => {
  return {
    item0: findItem(playerData["item0"]),
    item1: findItem(playerData["item1"]),
    item2: findItem(playerData["item2"]),
    item3: findItem(playerData["item3"]),
    item4: findItem(playerData["item4"]),
    item5: findItem(playerData["item5"]),
    item6: findItem(playerData["item6"])
  }
}

const buildSummonerBuild = (playerData, player) => {
  return {
    items: buildSummonerItemBuild(playerData),
    runes: {
      primary: runes.find((item) => item["id"] === playerData["perkPrimaryStyle"])["name"],
      secondary: runes.find((item) => item["id"] === playerData["perkSubStyle"])["name"]
    },
    summonerSpells: {
      one: findSummonerSpell(player["spell1Id"]),
      two: findSummonerSpell(player["spell2Id"])
    }
  }
}

const buildSummonerStats = (player, playerId, players) => {
  const playerData = player["stats"];

  return {
    name: players[playerId],
    team: player["teamId"],
    champion: findChampion(player["championId"]),
    role: player["timeline"]["role"],
    build: buildSummonerBuild(playerData, player),
    stats: {
      win: playerData["win"],
      championLevel: playerData["champLevel"],
      score: {
        kills: playerData["kills"],
        deaths: playerData["deaths"],
        assists: playerData["assists"],
        kda: calcKDA(playerData),
        highestMultiKill: calcHighestMultiKill(playerData),
        visionScore: playerData["visionScore"],
        pinkWards: playerData["visionWardsBoughtInGame"],
        creepScore: calcCreepScore(playerData)
      },
    }
  }
}

/***** Data digging methods *****/

const pullSummonersInfo = (gameDetails) => {
  const summonersInfo = {};

  gameDetails["participantIdentities"].forEach((player) => {
    summonersInfo[`${player["participantId"]}`] = player["player"]["summonerName"];
  });

  return summonersInfo;
}

const pullSummonersData = (gameDetails, players) => {
  let summonerStats = {};

  gameDetails["participants"].forEach((player) => {
    const playerId = player["participantId"]
    summonerStats[playerId] = buildSummonerStats(player, playerId, players);
  });

  return summonerStats;
}

/***** Methods to find item, champion, rune and spell names from static game data *****/

const findChampion = (championId) => {
  let champion;

  for (let champ in champions["data"]) {
    if (champions["data"][champ]["key"] == championId) {
      champion = champions["data"][champ]["name"];
    }
  }

  return champion;
}

const findItem = (itemId) => {
  const itemData = items["data"][itemId]
  const item = itemData ? itemData["name"] : "Empty slot";
  return item;
}

const findSummonerSpell = (spellId) => {
  let summonerSpell;

  for (let spell in summoners["data"]) {
    if (summoners["data"][spell]["key"] == spellId) {
      summonerSpell = summoners["data"][spell]["name"];
    }
  }

  return summonerSpell;
}

/***** Calculation methods *****/

const calcGameDuration = (gameData) => {
  let seconds = gameData["gameDuration"] % 60;
  seconds = `${seconds}`.length > 1 ? seconds : `0${seconds}` ;
  const minutes = Math.floor(gameData["gameDuration"] / 60);
  const hours = Math.floor(gameData["gameDuration"] / 3600);
  const gameDuration = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  return gameDuration;
}

const calcCreepScore = (playerData) => {
  let creepScore = 0;
  creepScore += playerData["totalMinionsKilled"];
  creepScore += playerData["neutralMinionsKilled"];
  creepScore += playerData["neutralMinionsKilledTeamJungle"];
  creepScore += playerData["neutralMinionsKilledEnemyJungle"];
  return creepScore;
}

const calcKDA = (playerData) => {
  kills = playerData["kills"];
  deaths = playerData["deaths"];
  assists = playerData["assists"];
  return ((kills + assists) / deaths).toFixed(2);
}

const calcHighestMultiKill = (playerData) => {
  const multiKills = { 2: "Double", 3: "Triple", 4: "Quadra", 5: "Penta", 6: "Unreal" };
  const highestMultiKill = multiKills[playerData["largestMultiKill"]];
  return highestMultiKill;
}

module.exports = RiotGamesAPI;
