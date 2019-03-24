const express = require("express");
const env = require("dotenv");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

env.config();

const RiotGamesAPI = require("./services/RiotGamesAPI");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

PORT = process.env.PORT || 5000;
VALIDATION_REGEX = /^[0-9\w{0,16} _\.]+$/;

/***** Server API Routes *****/

app.get("/api/matchHistory/:summonerName", cors(), async (req, res, next) => {
  const { summonerName } = req.params;

  // Handle no summmoner name input
  if (!summonerName) return res.status(400).send({ error: "Please input summoner name." });
  
  // Handle summoner name char validation
  if (!VALIDATION_REGEX.test(summonerName)) return res.status(400).send({ error: "Please input valid summoner name." });
  
  try {
    matchHistory = await RiotGamesAPI.getMatchHistory(summonerName); 
  } catch (err) {
    const errData = err.response.data.status;
    if (errData.status_code === 404) {
      return res.status(404).send(errData);
    }
    return res.status(500).send(errData);
  }

  res.send(matchHistory);
});

/***** Single Page Application Route *****/

// Production mode
if (process.env.NODE_ENV === "production") {
  // Static file declaration
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  })
}

/***** Basic server start *****/

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
