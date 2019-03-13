import React from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Header from "./components/header";
import ItemTable from "./components/itemTable";
import StartingBalanceBox from "./components/startingBalanceBox";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";

import { CSSTransition } from "react-transition-group";

import { connect } from "react-redux";
import {
  getItems,
  addItem,
  editItem,
  removeItem,
  resetAllItems
} from "./actions/itemActions";
import {
  getStartBalance,
  updateStartBalance,
  resetAllStartBalance
} from "./actions/startBalanceActions";
import {
  loginUser,
  registerUser,
  logoutUser,
  setCurrentUser,
  getUserId
} from "./actions/authActions";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmitItem = this.handleSubmitItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.changeChartPeriod = this.changeChartPeriod.bind(this);
    this.changeChartType = this.changeChartType.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
    this.addEditedItem = this.addEditedItem.bind(this);
    this.updateStartBalanceWithDatabaseData = this.updateStartBalanceWithDatabaseData.bind(
      this
    );
    this.updateItemsWithDatabaseData = this.updateItemsWithDatabaseData.bind(
      this
    );

    this.state = {
      incomeItems: [],
      expenseItems: [],
      startBalance: { startingDate: new Date(), startingBalance: 0 },
      arrayOfAllItems: [],
      accountBalanceArray: [],
      accumulatedIncomeArray: [],
      accumulatedExpenseArray: [],
      chartPeriod: 27,
      addItemKey: 0,
      incomeEditKey: null,
      expenseEditKey: null,
      editItemEndDateExists: null,
      incomeTotalAmount: 0,
      expenseTotalAmount: 0,
      chartType: "donut"
    };
  }

  componentDidMount() {
    this.updateLineChartArrays();
    // Check for token to keep user logged in
    if (localStorage.jwtToken) {
      const token = localStorage.jwtToken;
      setAuthToken(token);
      const decoded = jwt_decode(token);
      store.dispatch(setCurrentUser(decoded));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) store.dispatch(logoutUser());

      this.props.getUserId(decoded.id).then(res =>
        this.setState({ userId: res.data }, () => {
          this.updateStartBalanceWithDatabaseData();
          this.updateItemsWithDatabaseData();
        })
      );
    }
  }

  componentDidUpdate(prevProps) {
    // update userId to current
    if (this.props.userId !== prevProps.userId) {
      this.props
        .getUserId(this.props.userId.user.id)
        .then(res => this.setState({ userId: res.data }));
    }
  }

  // function that runs when "edit" button is clicked
  handleEditItem(item) {
    item.incomeOrExpense === "Income"
      ? this.setState({
          incomeEditKey: item.key
        })
      : this.setState({
          expenseEditKey: item.key
        });
  }

  // function that runs when "confirm edit" button is clicked
  addEditedItem(item) {
    let { incomeItems, expenseItems } = this.state;
    let arrayOfAllItems;

    const editedItem = {
      amount: item.amount,
      description: item.description,
      endDateExists: item.endDateExists,
      frequency: item.frequency,
      incomeOrExpense: item.incomeOrExpense,
      startDate: item.startDate,
      endDate: item.endDate,
      key: item.editItemKey
    };

    if (editedItem.incomeOrExpense === "Income") {
      const incomeItemEditIndex = incomeItems.findIndex(
        i => i.key === editedItem.key
      );

      incomeItems[incomeItemEditIndex] = editedItem;
      arrayOfAllItems = incomeItems.concat(expenseItems);

      this.setState(
        {
          incomeEditKey: null,
          incomeItems: incomeItems,
          arrayOfAllItems: arrayOfAllItems
        },
        () => this.updateLineChartArrays()
      );
    } else {
      const expenseItemEditIndex = expenseItems.findIndex(
        i => i.key === editedItem.key
      );

      expenseItems[expenseItemEditIndex] = editedItem;
      arrayOfAllItems = incomeItems.concat(expenseItems);

      this.setState(
        {
          expenseEditKey: null,
          expenseItems: expenseItems,
          arrayOfAllItems: arrayOfAllItems
        },
        () => this.updateLineChartArrays()
      );
    }

    // update database with updated details
    if (this.props.userId.isAuthenticated)
      this.props.editItem(this.props.userId.user.id, editedItem);
  }

  // function that creates data for pie/bar charts from arrayOfAllItems
  updatePieAndBarChartData() {
    const incomeChartLabels = [];
    const incomeChartData = [];
    const expenseChartLabels = [];
    const expenseChartData = [];
    const arrayOfAllItems = this.state.arrayOfAllItems;
    const accountBalanceArray = this.state.accountBalanceArray;
    const colors = [
      "#ff6384",
      "#ff9f40",
      "#ffcd56",
      "#4bc0c0",
      "#36a2eb",
      "#d9f442",
      "#47f441",
      "#41f4e2",
      "#9a41f4",
      "#f4419a",
      "#999999",
      "#494949",
      "#d88888",
      "#a2e57b",
      "#6f98ce",
      "#d8728e"
    ];

    arrayOfAllItems.forEach(item => {
      let arr = this.handleItem(item, accountBalanceArray);
      let accumulatedTotal = arr[this.state.chartPeriod - 1];

      if (accumulatedTotal > 0) {
        incomeChartLabels.push(item.description);
        incomeChartData.push(accumulatedTotal);
      } else if (0 > accumulatedTotal) {
        expenseChartLabels.push(item.description);
        expenseChartData.push(-accumulatedTotal);
      }
    });

    const barChartIncomeItemColors = new Array(incomeChartData.length).fill(
      "rgba(75,192,192,0.6)"
    );
    const barChartExpenseItemColors = new Array(expenseChartData.length).fill(
      "rgba(244,191,66,0.6)"
    );

    return {
      incomePieChartData: {
        labels: incomeChartLabels,
        datasets: [
          {
            data: incomeChartData,
            backgroundColor: colors
          }
        ]
      },
      expensePieChartData: {
        labels: expenseChartLabels,
        datasets: [
          {
            data: expenseChartData,
            backgroundColor: colors
          }
        ]
      },
      barChartData: {
        labels: [...incomeChartLabels, ...expenseChartLabels],
        datasets: [
          {
            data: [...incomeChartData, ...expenseChartData],
            backgroundColor: barChartIncomeItemColors.concat(
              barChartExpenseItemColors
            )
          }
        ]
      }
    };
  }

  // function that changes period of charts (1-year, 2-year, 5-year) based on radio select buttons
  changeChartPeriod(e) {
    this.setState({ chartPeriod: Number(e.target.value) }, () => {
      this.updateLineChartArrays();
    });
  }

  // function that changes chart type based on radio select buttons
  changeChartType(e) {
    this.setState({ chartType: e.target.value });
  }

  // function that creates data for line chart from accountBalanceArray
  createLineChartData() {
    const lineChartData = this.state.accountBalanceArray.map(x => x.balance);
    const lineChartLabels = this.state.accountBalanceArray.map(x =>
      new Date(x.date).toLocaleDateString()
    );
    const lineChartParameters = {
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10
    };

    return {
      labels: lineChartLabels,
      datasets: [
        {
          ...lineChartParameters,
          label: "Balance",
          fill: false,
          lineTension: 0.2,
          backgroundColor: "rgba(255,61,61,0.4)",
          borderColor: "rgba(255,61,61,0.8)",
          pointBorderColor: "rgba(255,61,61,1)",
          pointHoverBackgroundColor: "rgba(255,61,61,1)",
          pointHoverBorderColor: "rgba(255,61,61,1)",
          data: lineChartData
        },
        {
          ...lineChartParameters,
          label: "Accumulated Income",
          fill: "origin",
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(75,192,192,1)",
          hidden: true,
          data: this.state.accumulatedIncomeArray
        },
        {
          ...lineChartParameters,
          label: "Accumulated Expense",
          fill: "origin",
          lineTension: 0.1,
          backgroundColor: "rgba(244,191,66,0.4)",
          borderColor: "rgba(244,191,66,1)",
          pointBorderColor: "rgba(244,191,66,1)",
          pointHoverBackgroundColor: "rgba(244,191,66,1)",
          pointHoverBorderColor: "rgba(244,191,66,1)",
          hidden: true,
          data: this.state.accumulatedExpenseArray
        }
      ]
    };
  }

  // function that creates arrays to be used for line charts using this.state.arrayOfAllItems & this.state.startBalance. Sets state with created arrays
  // sets accumulated total amounts for income and expense
  updateLineChartArrays() {
    const { arrayOfAllItems, startBalance } = this.state;

    const accountBalanceArray = [
      {
        date: Date.parse(startBalance.startingDate),
        balance: startBalance.startingBalance
      }
    ];

    for (let i = 1; i < this.state.chartPeriod; i++) {
      accountBalanceArray.push({
        date: accountBalanceArray[0].date + i * 1209600000,
        balance: accountBalanceArray[i - 1].balance
      });
    }

    const accumulatedIncomeArray = new Array(this.state.chartPeriod).fill(0);
    const accumulatedExpenseArray = new Array(this.state.chartPeriod).fill(0);

    arrayOfAllItems.forEach(item => {
      let arr = this.handleItem(item, accountBalanceArray);
      for (let i = 0; i < this.state.chartPeriod; i++) {
        accountBalanceArray[i].balance += arr[i];
        item.incomeOrExpense === "Income"
          ? (accumulatedIncomeArray[i] += arr[i])
          : (accumulatedExpenseArray[i] += arr[i]);
      }
    });

    const incomeTotalAmount =
      accumulatedIncomeArray[this.state.chartPeriod - 1];
    const expenseTotalAmount =
      accumulatedExpenseArray[this.state.chartPeriod - 1];

    this.setState({
      accountBalanceArray: accountBalanceArray,
      accumulatedIncomeArray: accumulatedIncomeArray,
      accumulatedExpenseArray: accumulatedExpenseArray,
      incomeTotalAmount: incomeTotalAmount ? incomeTotalAmount : 0,
      expenseTotalAmount: expenseTotalAmount ? expenseTotalAmount : 0
    });
  }

  // function that returns an array from a single item. Array will be used to update accountBalanceArray
  handleItem(item, accountBalanceArray) {
    let interval;
    let amount;
    let incomeOrExpense = item.incomeOrExpense === "Income" ? 1 : -1;
    let emptyArray = new Array(this.state.chartPeriod).fill(0);
    const firstDayOfChartPeriod = accountBalanceArray[0]
      ? accountBalanceArray[0].date
      : null;
    const lastDayOfChartPeriod = accountBalanceArray[this.state.chartPeriod - 1]
      ? accountBalanceArray[this.state.chartPeriod - 1].date
      : null;
    const startDateOfItem = Date.parse(item.startDate);

    if (item.frequency === "One-time") {
      interval = 0;
      amount = item.amount;
    } else if (item.frequency === "Weekly") {
      interval = 1;
      amount = item.amount * 2;
    } else if (item.frequency === "Bi-weekly") {
      interval = 1;
      amount = item.amount;
    } else if (item.frequency === "Monthly") {
      interval = 2;
      amount = Math.round(item.amount * 0.94382);
    } else if (item.frequency === "Annually") {
      interval = 26;
      amount = item.amount;
    }

    let startDateIndex = accountBalanceArray.findIndex(
      i => i.date === this.roundToInterval(item.startDate)
    );

    if (startDateIndex === -1) {
      if (startDateOfItem < firstDayOfChartPeriod) {
        if (interval === 0) {
          return emptyArray;
        } else if (interval === 1) {
          startDateIndex = 0;
        } else if (interval === 2) {
          startDateIndex =
            Math.round((firstDayOfChartPeriod - startDateOfItem) / 1209600000) %
            2
              ? 1
              : 0;
        } else {
          startDateIndex =
            Math.round((startDateOfItem - firstDayOfChartPeriod) / 1209600000) +
            26;
          while (startDateIndex < 0) {
            startDateIndex += 26;
          }
        }
      } else if (lastDayOfChartPeriod < startDateOfItem) {
        return emptyArray;
      }
    }

    let endDateIndex;

    if (!item.endDateExists) {
      endDateIndex = this.state.chartPeriod - 1;
    } else {
      if (Date.parse(item.endDate) < firstDayOfChartPeriod) {
        return emptyArray;
      } else if (lastDayOfChartPeriod < Date.parse(item.endDate)) {
        endDateIndex = this.state.chartPeriod - 1;
      } else {
        endDateIndex = accountBalanceArray.findIndex(
          i => i.date === this.roundToInterval(item.endDate)
        );
      }
    }

    return this.createArray(
      interval,
      amount,
      incomeOrExpense,
      startDateIndex,
      endDateIndex
    );
  }

  // function that creates an array to be used to update accountBalanceArray using parameters set in handleItem()
  createArray(interval, amount, incomeOrExpense, startDateIndex, endDateIndex) {
    const arr = [];
    if (interval === 0) {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        startDateIndex <= i
          ? (arr[i] = amount * incomeOrExpense)
          : (arr[i] = 0);
      }
    } else if (interval === 1) {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        if (i <= startDateIndex) {
          arr[i] = 0;
        } else if (startDateIndex <= i && i <= endDateIndex) {
          arr[i] = amount * (i - startDateIndex + 1) * incomeOrExpense;
        } else if (endDateIndex < i) {
          arr[i] = arr[endDateIndex];
        }
      }
    } else {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        if (i < startDateIndex) {
          arr[i] = 0;
        } else if (startDateIndex <= i && i <= endDateIndex) {
          arr[i] =
            Math.ceil((i + 1 - startDateIndex) / interval) *
            amount *
            incomeOrExpense;
        } else if (endDateIndex < i) {
          arr[i] = arr[endDateIndex];
        }
      }
    }
    return arr;
  }

  // function that rounds input date to the nearest interval set by handleSubmitStartBalance()
  roundToInterval(startDate) {
    const startBalanceDate = Date.parse(this.state.startBalance.startingDate);
    return (
      Math.round(Date.parse(startDate) / 1209600000) * 1209600000 -
      (Math.round(startBalanceDate / 1209600000) * 1209600000 -
        startBalanceDate)
    );
  }

  // funtion that adds items to income or expense tables. Sets state. Updates line charts by calling this.updateLineChartArrays()
  handleSubmitItem(item) {
    const inputObject = {
      description: item.description,
      amount: item.amount === "" ? 0 : parseInt(item.amount, 10),
      frequency: item.frequency,
      startDate: item.startDate,
      endDateExists: item.endDateExists,
      endDate: item.endDate,
      incomeOrExpense: item.incomeOrExpense,
      key: item.key
    };

    const { incomeItems, expenseItems, arrayOfAllItems } = this.state;
    const nextAddItemKey = (inputObject.key += 0.01);

    inputObject.incomeOrExpense === "Income"
      ? incomeItems.push(inputObject)
      : expenseItems.push(inputObject);

    arrayOfAllItems.push(inputObject);

    this.setState(
      {
        addItemKey: nextAddItemKey,
        incomeItems: incomeItems,
        expenseItems: expenseItems,
        arrayOfAllItems: arrayOfAllItems
      },
      () => {
        this.updateLineChartArrays();
        if (this.props.userId.isAuthenticated) {
          this.uploadItemToDatabase(inputObject);
        }
      }
    );
  }

  // upload submitted item to database
  uploadItemToDatabase(inputObject) {
    const userId = this.props.userId.user.id;
    this.props.addItem(inputObject, userId);
  }

  // function that removes items from tables. Sets state with updated arrays.
  handleRemoveItem(item) {
    const { incomeItems, expenseItems } = this.state;
    const incomeItemsUpdated = incomeItems.filter(items => items !== item);
    const expenseItemsUpdated = expenseItems.filter(items => items !== item);
    const arrayOfAllItemsUpdated = [];

    incomeItemsUpdated.forEach(item => arrayOfAllItemsUpdated.push(item));
    expenseItemsUpdated.forEach(item => arrayOfAllItemsUpdated.push(item));

    if (this.props.userId.isAuthenticated) {
      this.props.removeItem(this.props.userId.user.id, item.key);
    }

    this.setState(
      {
        incomeItems: incomeItemsUpdated,
        expenseItems: expenseItemsUpdated,
        arrayOfAllItems: arrayOfAllItemsUpdated
      },
      () => {
        this.updateLineChartArrays();
      }
    );
  }

  // when login successful, bring startBalance from database to our app
  updateStartBalanceWithDatabaseData() {
    if (this.props.userId.isAuthenticated) {
      this.props.getStartBalance(this.props.userId.user).then(res =>
        this.setState(
          {
            startBalance: res
              ? res
              : { startingDate: new Date(), startingBalance: 0 }
          },
          () => this.updateLineChartArrays()
        )
      );
    }
  }

  // when login successful, bring startBalance from database to our app
  updateItemsWithDatabaseData() {
    if (this.props.userId.isAuthenticated) {
      const { incomeItems, expenseItems } = this.state;

      this.props.getItems(this.props.userId.user.id).then(() => {
        this.props.item.items.forEach(item => {
          item.incomeOrExpense === "Income"
            ? incomeItems.push(item)
            : expenseItems.push(item);
        });
        this.setState(
          {
            arrayOfAllItems: this.props.item.items,
            incomeItems: incomeItems,
            expenseItems: expenseItems,
            addItemKey: this.props.item.currentKey
              ? this.props.item.currentKey
              : 0
          },
          () => this.updateLineChartArrays()
        );
      });
    }
  }

  // function that handles startingBalance.
  handleSubmitStartBalance = e => {
    e.preventDefault();

    const startBalance = {
      startingDate: e.target[0].value,
      startingBalance: isNaN(e.target[1].value)
        ? 0
        : parseInt(e.target[1].value, 10)
    };

    this.setState(
      {
        startBalance: {
          startingBalance: startBalance.startingBalance,
          startingDate: new Date(startBalance.startingDate)
        }
      },
      () => {
        this.updateLineChartArrays();
        if (this.props.userId.isAuthenticated) {
          this.props.updateStartBalance(
            this.state.startBalance,
            this.props.userId.user.id
          );
        }
      }
    );

    e.target.reset();
  };

  resetData = resetDatabaseData => {
    if (resetDatabaseData && this.props.userId.isAuthenticated) {
      this.props.resetAllItems(this.props.userId.user.id);
      this.props.resetAllStartBalance(this.props.userId.user.id);
    }
    this.setState(
      {
        incomeItems: [],
        expenseItems: [],
        startBalance: { startingDate: new Date(), startingBalance: 0 },
        arrayOfAllItems: [],
        accountBalanceArray: [],
        accumulatedIncomeArray: [],
        accumulatedExpenseArray: [],
        chartPeriod: 27,
        addItemKey: 0,
        incomeEditKey: null,
        expenseEditKey: null,
        editItemEndDateCheckBoxDisabled: null,
        editItemEndDateExists: null,
        incomeTotalAmount: 0,
        expenseTotalAmount: 0
      },
      () => {
        this.updateLineChartArrays();
      }
    );
  };

  render() {
    const pieCharts = (
      <div className="pieChartsDiv">
        <div className="incomePieChartDiv">
          <Doughnut
            className="pieChart"
            data={this.updatePieAndBarChartData().incomePieChartData}
            width={400}
            height={500}
            options={{
              maintainAspectRatio: false,
              title: {
                display: true,
                text: `Total Income: $${this.state.incomeTotalAmount}`,
                fontSize: 19
              }
            }}
          />
        </div>
        <div className="expensePieChartDiv">
          <Doughnut
            className="pieChart"
            data={this.updatePieAndBarChartData().expensePieChartData}
            width={400}
            height={500}
            options={{
              maintainAspectRatio: false,
              title: {
                display: true,
                text: `Total Expense: $${-this.state.expenseTotalAmount}`,
                fontSize: 19
              }
            }}
          />
        </div>
      </div>
    );

    const barChart = (
      <div className="lineChartDiv">
        <Bar
          data={this.updatePieAndBarChartData().barChartData}
          width={800}
          height={500}
          options={{
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
              display: true,
              text: `Total Income: $${
                this.state.incomeTotalAmount
              }                               Total Expense: $${-this.state
                .expenseTotalAmount}`,
              fontSize: 19
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    callback: value => {
                      return "$" + value;
                    },
                    min: 0
                  }
                }
              ]
            }
          }}
        />
      </div>
    );

    return (
      <div>
        <Header
          loginUser={this.props.loginUser}
          registerUser={this.props.registerUser}
          logoutUser={this.props.logoutUser}
          loggedIn={this.props.userId.isAuthenticated}
          updateStartBalanceWithDatabaseData={
            this.updateStartBalanceWithDatabaseData
          }
          updateItemsWithDatabaseData={this.updateItemsWithDatabaseData}
          updateAddItemKeyWithDatabaseData={
            this.updateAddItemKeyWithDatabaseData
          }
          updateUserId={this.updateUserId}
          userId={this.state.userId}
          resetData={this.resetData}
          addItem={this.props.addItem}
          updateStartBalance={this.props.updateStartBalance}
          items={this.state.arrayOfAllItems}
          startBalance={this.state.startBalance}
          loginErrors={this.props.loginErrors}
          registerErrors={this.props.registerErrors}
        />
        <CSSTransition in={true} appear={true} timeout={800} classNames="fade">
          <div>
            <div className="chartsDiv">
              <div className="lineChartDiv">
                <Line
                  className="lineChart"
                  data={this.createLineChartData()}
                  width={800}
                  height={500}
                  options={{
                    maintainAspectRatio: false,
                    title: {
                      display: true,
                      text: "Account Balance Projection",
                      fontSize: 19
                    },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            callback: value => {
                              return "$" + value;
                            }
                          }
                        }
                      ]
                    }
                  }}
                />
              </div>
              {this.state.chartType === "donut" ? pieCharts : barChart}
            </div>

            <StartingBalanceBox
              handleSubmitStartBalance={this.handleSubmitStartBalance}
              changeChartPeriod={this.changeChartPeriod}
              changeChartType={this.changeChartType}
              resetData={this.resetData}
            />

            <div className="itemTablesDiv">
              <div className="incomeTable">
                <ItemTable
                  title="Income"
                  items={this.state.incomeItems}
                  handleSubmitItem={this.handleSubmitItem}
                  handleRemoveItem={this.handleRemoveItem}
                  incomeOrExpense="Income"
                  addItemKey={this.state.addItemKey}
                  handleEditItem={this.handleEditItem}
                  editItemKey={this.state.incomeEditKey}
                  addEditedItem={this.addEditedItem}
                />
              </div>
              <div className="expenseTable">
                <ItemTable
                  title="Expense"
                  items={this.state.expenseItems}
                  handleSubmitItem={this.handleSubmitItem}
                  handleRemoveItem={this.handleRemoveItem}
                  incomeOrExpense="Expense"
                  addItemKey={this.state.addItemKey}
                  handleEditItem={this.handleEditItem}
                  editItemKey={this.state.expenseEditKey}
                  addEditedItem={this.addEditedItem}
                />
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startBalance: state.startBalance,
  item: state.item,
  userId: state.auth,
  registerErrors: state.registerErrors,
  loginErrors: state.loginErrors
});

export default connect(
  mapStateToProps,
  {
    getStartBalance,
    updateStartBalance,
    resetAllStartBalance,
    getItems,
    addItem,
    editItem,
    removeItem,
    resetAllItems,
    loginUser,
    registerUser,
    logoutUser,
    getUserId
  }
)(App);
