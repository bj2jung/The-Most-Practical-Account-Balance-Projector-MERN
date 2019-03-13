import React from "react";
import { Button } from "reactstrap";

class LogoutButton extends React.Component {
  render() {
    return (
      <div>
        <Button
          id="logoutButton"
          type="button"
          onClick={() => {
            this.props.logoutUser();
            this.props.resetData(false);
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }
}

export default LogoutButton;
