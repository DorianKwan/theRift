const express      = require("express");
const env          = require("dotenv");
const path         = require("path");
const cors         = require("cors");
const RiotGamesAPI = require("./services/RiotGamesAPI");

env.config();
const app = express();

PORT             = process.env.PORT || 5000;
VALIDATION_REGEX = /^[0-9\w{0,16} _\.]+$/;

/***** Single Page Application Route *****/

// Production mode
if (process.env.NODE_ENV === "production") {
  // Static file declaration
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  })
}

/***** Server API Routes *****/

app.get("/api/matchHistory/:summonerName", cors(), async (req, res) => {
  const { summonerName } = req.params

  // Handle no summmoner name input
  if (!summonerName) return;

  // Handle summoner name char validation
  if (!VALIDATION_REGEX.test(summonerName)) return;

  matchHistory = await RiotGamesAPI.getMatchHistory(summonerName);

  res.json(matchHistory);
});

/***** Basic server start *****/

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

