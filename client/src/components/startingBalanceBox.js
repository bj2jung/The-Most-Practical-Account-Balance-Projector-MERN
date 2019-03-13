import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import updateButton from "../images/update_icon.png";
import resetButton from "../images/reset_icon.png";

class StartingBalanceBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div className="optionsDiv">
        <h2 className="optionsDivHeader">Options</h2>
        <div className="optionsDivContent">
          <div>
            <h5>Set Start Date and Balance</h5>
          </div>
          <div>
            <h5>Set Chart Type</h5>
          </div>
          <div>
            <h5>Set Chart Period</h5>
          </div>
          <div>
            <h5>Clear All</h5>
          </div>
          <form onSubmit={e => this.props.handleSubmitStartBalance(e)}>
            <div className="optionsDateSelectorDiv">
              <DatePicker
                id="optionsDateSelector"
                selected={this.state.startDate}
                onChange={this.handleChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className="centered">
              <div className="group">
                <input id="optionsAmount" type="text" required="required" />
                <label htmlFor="optionsAmount">Balance</label>
              </div>
            </div>
            <input
              id="updateStartingBalance"
              type="image"
              alt="Update"
              src={updateButton}
            />
          </form>
          <div className="chartSelectDiv">
            <label className="chartRadioOption">
              <input
                type="radio"
                name="chartType"
                onChange={this.props.changeChartType}
                value={"donut"}
                defaultChecked
              />
              Donut
            </label>
            <label className="chartRadioOption">
              <input
                type="radio"
                name="chartType"
                onChange={this.props.changeChartType}
                value={"bar"}
              />
              Bar
            </label>
          </div>
          <div className="periodSelectDiv">
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={27}
                defaultChecked
              />
              1-Year
            </label>
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={53}
              />
              2-Year
            </label>
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={131}
              />
              5-Year
            </label>
          </div>
          <div>
            <input
              id="resetButton"
              type="image"
              src={resetButton}
              alt="Reset"
              onClick={() => this.props.resetData(true)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StartingBalanceBox;
