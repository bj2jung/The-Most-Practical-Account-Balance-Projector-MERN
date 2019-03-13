import React from "react";
import { Table } from "reactstrap";
import AddItemRow from "./addItemRow.js";
import EditItemRow from "./editItemRow.js";
import editItemButton from "../images/edit_icon.png";
import removeItemButton from "../images/remove_icon.png";
import { CSSTransition } from "react-transition-group";

class ItemTable extends React.Component {
  render() {
    const rows = [];

    // gather items for income and expense tables and add to rows array
    if (this.props.items.length > 0) {
      this.props.items.forEach(item => {
        rows.push(
          <CSSTransition
            in={true}
            appear={true}
            timeout={400}
            classNames="fade"
            key={item.key}
          >
            <ItemRow
              item={item}
              key={item.key}
              handleRemoveItem={this.props.handleRemoveItem}
              handleEditItem={this.props.handleEditItem}
            />
          </CSSTransition>
        );
      });
    }

    // if there is an item to edit, swap the existing row with EditItemRow component
    if (this.props.editItemKey) {
      const editIndex = this.props.items.findIndex(
        item => item.key === this.props.editItemKey
      );

      rows[editIndex] = (
        <EditItemRow
          key="editItemRow"
          editItemKey={this.props.editItemKey}
          incomeOrExpense={this.props.incomeOrExpense}
          addEditedItem={this.props.addEditedItem}
          detailsBeforeEdit={this.props.items[editIndex]}
        />
      );
    }

    // add AddItemRow component to the end of the row array
    rows.push(
      <AddItemRow
        key="addItemRow"
        incomeOrExpense={this.props.incomeOrExpense}
        handleSubmitItem={this.props.handleSubmitItem}
        addItemKey={this.props.addItemKey}
      />
    );

    return (
      <div className="">
        <h2 className="sub-header">{this.props.title}</h2>
        <div className="border  table-wrapper-scroll-y">
          <Table striped responsive>
            <thead>
              <tr>
                <th className="column1">Description</th>
                <th className="column2">Amount</th>
                <th className="column3">Frequency</th>
                <th className="column4">Start Date</th>
                <th className="column5" />
                <th className="column6">End Date</th>
                <th className="column7" />
              </tr>
            </thead>

            <tbody className="tableBody">{rows}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

function ItemRow(props) {
  const description =
    props.item.description === "" ? `No description` : props.item.description;
  const { amount, frequency, startDate } = props.item;
  const endDate = props.item.endDateExists ? props.item.endDate : "N/A";
  const { item } = props;

  return (
    <tr>
      <td className="column1">{description}</td>
      <td className="column2">${amount}</td>
      <td className="column3">{frequency}</td>
      <td className="column4">{startDate}</td>
      <td className="column5" />
      <td className="column6">{endDate}</td>
      <td className="column7">
        <input
          type="image"
          alt="edit"
          src={editItemButton}
          className="editItemButton"
          onClick={() => props.handleEditItem(item)}
        />
        <input
          type="image"
          alt="-"
          src={removeItemButton}
          className="removeItemButton"
          onClick={() => props.handleRemoveItem(item)}
        />
      </td>
    </tr>
  );
}

export default ItemTable;
