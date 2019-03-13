import React from "react";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import classNames from "classnames";
import confirmButton from "../images/confirm_icon.png";

class LoginPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      password: ""
    };
    this.onChange = this.onChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.loginErrors !== prevProps.loginErrors) {
      this.setState({ loginErrors: this.props.loginErrors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    this.props.resetData();

    this.props.loginUser(this.state).then(() => {
      this.props.updateStartBalanceWithDatabaseData();
      this.props.updateItemsWithDatabaseData();
    });
  }

  render() {
    const { loginErrors } = this.props;

    const errorMessages = (
      <p>
        {Object.values(loginErrors)[0]} <br />
        {Object.values(loginErrors)[1]} <br />
      </p>
    );

    return (
      <div>
        <Button id="loginButton" type="button">
          Sign in
        </Button>

        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          target="loginButton"
        >
          <PopoverHeader>Sign in</PopoverHeader>
          <PopoverBody>
            <form id="loginForm" onSubmit={this.handleLoginSubmit}>
              <input
                type="text"
                id="userId"
                placeholder="User ID"
                name="userId"
                onChange={this.onChange}
                className={classNames("", {
                  invalid: loginErrors.userId || loginErrors.userIdnotfound
                })}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                onChange={this.onChange}
                className={classNames("", {
                  invalid: loginErrors.password
                })}
              />
              <input
                type="image"
                src={confirmButton}
                id="confirmButton"
                alt="submit"
              />
            </form>
            <div className="errorMessages">
              {Object.keys(loginErrors).length > 0 ? errorMessages : ""}
            </div>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
  }
}

export default LoginPopup;
