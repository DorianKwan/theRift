import React, {Component} from "react";
import axios from "axios";
import "./app.scss";
import MatchHistory from "./pages/MatchHistory";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerName: "",
      textInput: "",
      matchHistory: null,
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
    this.setState({ isLoading: false });
    const error = this.state.errorMessage;
    return (
      <p className="error-message">{error}</p>
    );
  }

  renderSummonerForm() {
    const errorMessage = this.state.errorMessage ? this.renderErrorMessage() : "";
    const isSubmitDisabled = this.state.textInput.length < 3;
    const submitButton = <button disabled={isSubmitDisabled} 
                                 className="button is-info is-wide" 
                                 onClick={this.fetchMatchHistory}>Find Match History</button>;

    return (
      <div>
        <h2>Find Summoner Match History</h2>
        {errorMessage}
        <input type="text" name="summoner" placeholder="Enter Summoner Name" 
          onChange={(e) => this.summonerInputChangeHandler(e)} 
          value={this.state.textInput} />
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
    const { textInput } = this.state;
    this.setState({ isLoading: true, summonerName: textInput });
    const isInputValid  = this.validateInput(textInput);
    if (isInputValid) {
      axios.get("/api/matchHistory/" + textInput)
      .then(response => {
        this.setState({ matchHistory: response.data, isLoading: false, errorMessage: null, textInput: "" });
      }).catch(error => {
        this.setState({ isLoading: false, errorMessage: error });
      });
    }
  }
  
  summonerInputChangeHandler(element) {
    this.setState({ textInput: element.target.value });
  }
}
