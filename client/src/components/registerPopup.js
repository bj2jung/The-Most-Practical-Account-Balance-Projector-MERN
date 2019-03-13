import React from "react";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import classNames from "classnames";
import confirmButton from "../images/confirm_icon.png";

class RegisterPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      password: "",
      password2: ""
    };
    this.onChange = this.onChange.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRegisterSubmit(e) {
    e.preventDefault();
    this.props.registerUser(this.state).then(() =>
      this.props.loginUser(this.state).then(res => {
        this.props.updateStartBalance(this.props.startBalance, res);
        this.props.items.forEach(item => this.props.addItem(item, res));
      })
    );
  }

  render() {
    const { registerErrors } = this.props;

    const errorMessages = (
      <p>
        {Object.values(registerErrors)[0]} <br />
        {Object.values(registerErrors)[1]} <br />
        {Object.values(registerErrors)[2]}
      </p>
    );

    return (
      <div>
        <Button id="registerButton" type="button">
          Save &amp; Sign up
        </Button>

        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          target="registerButton"
        >
          <PopoverHeader>Save Progress &amp; Sign up</PopoverHeader>
          <PopoverBody>
            <form id="registerForm" onSubmit={this.handleRegisterSubmit}>
              <input
                type="text"
                placeholder="User ID"
                name="userId"
                onChange={this.onChange}
                className={classNames("", {
                  invalid: registerErrors.userId
                })}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.onChange}
                className={classNames("", {
                  invalid: registerErrors.password || registerErrors.password2
                })}
              />
              <input
                type="password"
                placeholder="Confirm password"
                name="password2"
                onChange={this.onChange}
                className={classNames("", {
                  invalid: registerErrors.password || registerErrors.password2
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
              {Object.keys(registerErrors).length > 0 ? errorMessages : ""}
            </div>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
  }
}

export default RegisterPopup;
