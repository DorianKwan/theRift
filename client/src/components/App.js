import React, {Component} from "react";
import axios from "axios";
import "./app.scss";
import MatchHistory from "./pages/MatchHistory";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      matchHistory: "something",
      isLoading: false,
      errorMessage: null,
      validationRegex: /^[0-9\w{0,16} _\.]+$/
    }

    this.connectServer = this.connectServer.bind(this);
    this.fetchMatchHistory = this.fetchMatchHistory.bind(this);
    this.summonerInputChangeHandler = this.summonerInputChangeHandler.bind(this);
  }

  componentDidMount() {
    this.connectServer();
  }

  connectServer() {
    fetch("/");
  }

  validateInput(summonerName) {
    let isValid = true;

    if (!this.state.validationRegex.test(summonerName)) {
      const errorMessage = "Summoner name includes invalid characters.";
      this.setState({ errorMessage, isLoading: false });
      isValid = false;
    }

    return isValid;
  }

  renderErrorMessage() {
    const error = this.state.errorMessage;
    return (
      <p className="error-message">{error}</p>
    );
  }

  renderSubmitButton(isSubmitDisabled) {
    let button;
    if (isSubmitDisabled) {
      button = <button disabled className="button is-info is-wide" onClick={this.fetchMatchHistory}>Find Match History</button>;
    } else {
      button = <button className="button is-info is-wide" onClick={this.fetchMatchHistory}>Find Match History</button>;
    }
    return (
      button
    );
  }

  renderSummonerForm() {
    const errorMessage = this.state.errorMessage ? this.renderErrorMessage() : "";
    const isSubmitDisabled = this.state.summonerName.length < 3;
    const submitButton = this.renderSubmitButton(isSubmitDisabled);

    return (
      <div>
        <h2>Find Summoner Match History</h2>
        {errorMessage}
        <input type="text" name="summoner" placeholder="Enter Summoner Name" 
          onChange={(e) => this.summonerInputChangeHandler.call(this, e)} 
          value={this.state.summonerName} />
        <br />
        {submitButton}
      </div>
    );
  }

  renderLoader() {
    return (
      <div>
        <div className="lds-spinner">
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
        </div>
        <p className="loading-message">Please Wait..</p>
      </div>
    );
  }

  render() {
    const content = this.state.isLoading ? this.renderLoader() : this.renderSummonerForm();

    return (
    <div className="main container has-text-centered">
      <h1>the Rift</h1>
      {content}
      <MatchHistory matches={this.state.matchHistory} summoner={this.state.summonerName} />
    </div>
    );
  }

  fetchMatchHistory() {
    const { summonerName } = this.state;
    this.setState({ isLoading: true });
    const isInputValid  = this.validateInput(summonerName);
    if (isInputValid && this.state.offCooldown) {
      axios.get("/api/matchHistory/" + summonerName)
      .then(response => {
        this.setState({ matchHistory: response.data, isLoading: false, errorMessage: null });
      }).catch(error => {
        console.log(error);
      });
    }
  }
  
  summonerInputChangeHandler(element) {
    this.setState({ summonerName: element.target.value });
  }
}
