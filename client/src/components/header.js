import React from "react";
import LoginPopup from "./loginPopup";
import RegisterPopup from "./registerPopup";
import LogoutButton from "./logoutButton";
import githubIcon from "../images/github_icon.png";

class Header extends React.Component {
  render() {
    let loginLogoutRegisterButtons;
    if (this.props.loggedIn) {
      loginLogoutRegisterButtons = (
        <div className="loginLogoutRegisterButtons">
          <h5 key="welcomeText">
            {typeof this.props.userId === "string"
              ? this.props.userId
              : "One sec..."}
          </h5>
          <LogoutButton
            key="logoutButton"
            logoutUser={this.props.logoutUser}
            resetData={this.props.resetData}
          />
        </div>
      );
    } else {
      loginLogoutRegisterButtons = (
        <div className="loginLogoutRegisterButtons">
          <LoginPopup
            key="loginPopup"
            loginUser={this.props.loginUser}
            updateStartBalanceWithDatabaseData={
              this.props.updateStartBalanceWithDatabaseData
            }
            updateItemsWithDatabaseData={this.props.updateItemsWithDatabaseData}
            updateAddItemKeyWithDatabaseData={
              this.props.updateAddItemKeyWithDatabaseData
            }
            updateUserId={this.props.updateUserId}
            loginErrors={this.props.loginErrors}
            resetData={this.props.resetData}
          />
          <RegisterPopup
            key="registerPopup"
            registerUser={this.props.registerUser}
            loginUser={this.props.loginUser}
            addItem={this.props.addItem}
            updateStartBalance={this.props.updateStartBalance}
            items={this.props.items}
            startBalance={this.props.startBalance}
            userId={this.props.userId}
            registerErrors={this.props.registerErrors}
          />
        </div>
      );
    }
    return (
      <header>
        <h1 className="App-header App-title">
          The Most Practical Account Balance Projector
        </h1>
        {loginLogoutRegisterButtons}
        <a
          href="https://github.com/bj2jung/The-Most-Practical-Account-Balance-Projector-MERN"
          className="githubLink"
        >
          <input id="githubIcon" type="image" src={githubIcon} alt="github" />
        </a>
      </header>
    );
  }
}

export default Header;
