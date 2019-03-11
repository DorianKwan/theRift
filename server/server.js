const express      = require("express");
const env          = require("dotenv");
const RiotGamesAPI = require("./services/RiotGamesAPI");

env.config();
const app = express();

PORT             = process.env.PORT;
VALIDATION_REGEX = /^[0-9\\p{L} _\\.]+$/;

/***** Single Page Application Route *****/

// Production mode
if (process.env.NODE_ENV === "production") {
  // Static file declaration
  app.use(express.static(path.join(__dirname, "../client/dist/app_bundle")));

  app.get("*", (req, res) => {
    res.sendfile(path.join(__dirname = "../client/dist/index.html"));
  })
}

/***** Server API Routes *****/

app.get("/api/matchHistory/:summonerName", async (req, res) => {
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

