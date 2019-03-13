import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import confirmButton from "../images/confirm_icon.png";

class EditItemRow extends React.Component {
  constructor(props) {
    super(props);
    const { detailsBeforeEdit } = this.props;

    this.state = {
      startDateSelector: moment(new Date(detailsBeforeEdit.startDate)),
      endDateSelector: moment(new Date(detailsBeforeEdit.endDate)),
      description: detailsBeforeEdit.description,
      amount: detailsBeforeEdit.amount,
      frequency: detailsBeforeEdit.frequency,
      endDateExistsCheckBoxDisabled:
        detailsBeforeEdit.frequency === "One-time" ? true : false,
      endDateExists: detailsBeforeEdit
        ? detailsBeforeEdit.endDateExists
        : false,
      endDateSelectorDisabled:
        detailsBeforeEdit.frequency === "One-time" ||
        !detailsBeforeEdit.endDateExists
          ? true
          : false,
      incomeOrExpense: this.props.incomeOrExpense,
      editItemKey: this.props.editItemKey
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleConfirmEdit = this.handleConfirmEdit.bind(this);
    this.handleEndDateCheckBoxClick = this.handleEndDateCheckBoxClick.bind(
      this
    );
    this.handleFrequencySelect = this.handleFrequencySelect.bind(this);
  }

  componentDidUpdate() {
    if (this.props.detailsBeforeEdit.description !== this.state.description)
      this.setState({
        description: this.props.detailsBeforeEdit.description,
        startDateSelector: moment(
          new Date(this.props.detailsBeforeEdit.startDate)
        ),
        endDateSelector: moment(new Date(this.props.detailsBeforeEdit.endDate)),
        endDateExistsCheckBoxDisabled:
          this.props.detailsBeforeEdit.frequency === "One-time" ? true : false,
        endDateExists: this.props.detailsBeforeEdit
          ? this.props.detailsBeforeEdit.endDateExists
          : false,
        endDateSelectorDisabled:
          this.props.detailsBeforeEdit.frequency === "One-time" ||
          !this.props.detailsBeforeEdit.endDateExists
            ? true
            : false
      });
  }

  handleStartDateChange(date) {
    this.setState({
      startDateSelector: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDateSelector: date
    });
  }

  // enable/disable endDateSelector based on endDateExists checkbox. If endDate checkbox is checked, selector is enabled.
  handleEndDateCheckBoxClick() {
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    ).checked;
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;

    this.setState({
      endDateExists: itemEndDateExists ? true : false,
      endDateSelectorDisabled:
        itemFrequency === "One-time" || !itemEndDateExists ? true : false
    });
  }

  // enable/disable endDateExists checkbox. If frequency === one-time, checkbox is disabled.
  handleFrequencySelect() {
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    ).checked;

    this.setState({
      endDateExistsCheckBoxDisabled:
        itemFrequency === "One-time" ? true : false,
      endDateExists: itemEndDateExists ? true : false,
      endDateSelectorDisabled:
        itemFrequency === "One-time" || !itemEndDateExists ? true : false
    });
  }

  // function that passes the edited item to App component which updates tables and charts accordingly
  handleConfirmEdit() {
    const itemDescription = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemDescription`
    );
    const itemAmount = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemAmount`
    );
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    );
    const itemStartDate = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemStartDate`
    ).value;
    const itemEndDate = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDate`
    ).value;

    this.setState(
      {
        description: itemDescription.value,
        amount: isNaN(itemAmount.value) ? 0 : itemAmount.value,
        frequency: itemFrequency,
        endDateExists:
          !itemEndDateExists.checked || itemFrequency === "One-time"
            ? false
            : true,
        startDate: itemStartDate,
        endDate: itemEndDate,
        editItemKey: this.props.editItemKey
      },
      () => {
        this.props.addEditedItem(this.state);
      }
    );
  }

  render() {
    return (
      <tr className="editItemRow">
        <td className="column1">
          <div className="centered">
            <div className="group" key={this.props.editItemKey}>
              <input
                id={`${this.state.incomeOrExpense}EditItemDescription`}
                type="text"
                defaultValue={this.props.detailsBeforeEdit.description}
                required="required"
              />
            </div>
          </div>
        </td>
        <td className="column2" key={this.props.editItemKey}>
          <div className="group">
            <input
              id={`${this.state.incomeOrExpense}EditItemAmount`}
              type="text"
              required="required"
              defaultValue={this.props.detailsBeforeEdit.amount}
            />
          </div>
        </td>
        <td className="column3 dropDown">
          <div className="select" key={this.props.editItemKey}>
            <select
              name="slct"
              className="dropDown"
              id={`${this.state.incomeOrExpense}EditItemFrequency`}
              onChange={this.handleFrequencySelect}
              defaultValue={this.props.detailsBeforeEdit.frequency}
            >
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </td>
        <td className="column4">
          <DatePicker
            id={`${this.state.incomeOrExpense}EditItemStartDate`}
            selected={this.state.startDateSelector}
            onChange={this.handleStartDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </td>
        <td className="column5">
          <div key={this.props.editItemKey}>
            <input
              id={`${this.state.incomeOrExpense}EditItemEndDateExists`}
              type="checkbox"
              onClick={this.handleEndDateCheckBoxClick}
              disabled={this.state.endDateExistsCheckBoxDisabled}
              defaultChecked={this.props.detailsBeforeEdit.endDateExists}
            />
          </div>
        </td>
        <td className="column6">
          <DatePicker
            id={`${this.state.incomeOrExpense}EditItemEndDate`}
            selected={this.state.endDateSelector}
            onChange={this.handleEndDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            disabled={this.state.endDateSelectorDisabled}
          />
        </td>
        <td className="column7">
          <input
            id="confirmButton"
            type="image"
            alt="confirm"
            src={confirmButton}
            onClick={this.handleConfirmEdit}
          />
        </td>
      </tr>
    );
  }
}

export default EditItemRow;
