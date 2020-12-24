import React from "react";
import {Error} from "./error";
import "./starships.css";


export class Starships extends React.Component {
  // Pulls a list of all available starships from the Star Wars API,
  // then pulls the pilot name for each pilot URL and loads a dropdown with 
  // each starship name.
  // When a starship is selected, loads a table of all pilot names for that 
  // starship.  
  constructor(props) {
    super(props);
    this.state = {error: null, downloadStarships: false, 
      downloadPilots: false, loadPilotNames: false, starshipName: null, 
      starshipDropdown: null, 
      pilotNameRows: <tr><td>Loading...</td></tr>};
    this.nextUrl = "https://swapi.dev/api/starships/";
    this.starshipData = {};
    this.pilotUrls = new Set();
    this.pilotInfo = {};
    this.selectStarshipName = this.selectStarshipName.bind(this);
  }
  getStarships() { 
    // Download all starship names and associated pilot URLs from the 
    // /starships endpoint.
    if (this.nextUrl != null) {
      fetch(this.nextUrl)
        .then(response => response.json())
        .then(
          (result) => {
            for (const starship of result["results"]) {
              (this.starshipData[starship["name"]] = 
                starship["pilots"]);
              for (const pilotUrl of starship["pilots"]) {
                this.pilotUrls.add(pilotUrl);
              }
            }
            this.nextUrl = result["next"];
            if (this.nextUrl != null) {
              this.setState({
                downloadStarships: true
              });
            }
            else {
              this.setState({
                downloadStarships: false,
                downloadPilots: true
              });
            }
          },
          (error) => {
            this.setState({
              error: error.message,
              downloadStarships: false
            });
          }
        )
    }
  }
  getPilotNames() {
    // Find the pilot name associated with each pilot URL.
    const allPilotUrls = this.pilotUrls.values();
    for (const pilotUrl of allPilotUrls) {
      fetch(pilotUrl)
        .then(response => response.json())
        .then(
          (result) => {
            this.pilotInfo[pilotUrl] = result["name"];
            this.pilotUrls.delete(pilotUrl);
            if (this.pilotUrls.size === 0) {
              this.setState({
                downloadPilots: false
              });
            }
          },
          (error) => {
            this.setState({
              error: error.message,
              downloadPilots: false
            });
            this.pilotInfo[pilotUrl] = "Unknown";
            this.pilotUrls.delete(pilotUrl);
          }
      )
    }
  }
  updatePilotInfo() {
    // Replace each pilot URL in the starship data with its associated name.
    for (const pilotEntries of Object.values(this.starshipData)) {
      for (let i = 0; i < pilotEntries.length; i++) {
        const pilotUrl = pilotEntries[i];
        const pilotName = this.pilotInfo[pilotUrl];
        pilotEntries[i] = pilotName;
      }
    }
  }
  loadStarshipDropdown() {
    // Load all the starship names into the form dropdown.
    let starshipDropdown = [];
    for (const starshipName of Object.keys(this.starshipData)) {
      starshipDropdown.push(
        <option value={starshipName} key={starshipName}>{starshipName}
        </option>
      );
    }
    this.setState({
      starshipDropdown: starshipDropdown,
      pilotNameRows: null
    });
  }
  selectStarshipName(event) {
    // Handle changes made in the Starship Name select dropdown.
    const target = event.target;
    const value = target.value;
    this.setState({
      starshipName: value,
      loadPilotNames: true
    });
  }
  loadPilotNames() {
    // Display all pilot names associated with the selected starship name 
    // in a table. 
    let pilotNameRows = [];
    if (this.starshipData[this.state.starshipName].length === 0) {
      pilotNameRows.push(
        <tr key="1"><td>No pilots found!</td></tr>
      );
    }
    for (const pilotName of this.starshipData[this.state.starshipName]) {
      pilotNameRows.push(
        <tr key={pilotName}><td>{pilotName}</td></tr>
      );
    }
    this.setState({
      pilotNameRows: pilotNameRows,
      loadPilotNames: false
    });
  }
  componentDidMount() {
    this.getStarships();
  }
  componentDidUpdate() {
    if (this.state.downloadStarships) {
      this.getStarships();
    }
    if (this.state.downloadPilots) {
      this.getPilotNames();
    }
    if (this.pilotUrls.size === 0 && this.state.starshipDropdown === null) {
      this.updatePilotInfo();
      this.loadStarshipDropdown();
    }
    if (this.state.loadPilotNames) {
      this.loadPilotNames();
    }
  }
  render() {
    return (
      <React.Fragment>
      <p className="title">Star Wars Starship Pilots</p>
      <form className="starship-select">
      <p><label htmlFor="starshipName">Starship:&nbsp;
      <select name="starshipName" onChange={this.selectStarshipName}>
        <option value=""></option>
        {this.state.starshipDropdown}
      </select>
      </label></p>
      </form>
      <table className="pilot-table">
        <tbody>
        {this.state.pilotNameRows}
        </tbody>
      </table>
      {this.state.error && <Error message={this.state.error} />}
      </React.Fragment>
    );
  }
}