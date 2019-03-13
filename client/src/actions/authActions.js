import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_LOGIN_ERRORS,
  GET_REGISTER_ERRORS,
  SET_CURRENT_USER
} from "./types";

// Register User
export const registerUser = userData => dispatch => {
  return new Promise(resolve => {
    axios
      .post("/api/users/register", userData)
      .then(() => resolve())
      .catch(err => {
        dispatch({
          type: GET_REGISTER_ERRORS,
          payload: err.response.data
        });
      });
  });
};

// Login - get user token
export const loginUser = userData => dispatch => {
  return new Promise(resolve => {
    axios
      .post("/api/users/login", userData)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        resolve(res.data.userId);
      })
      .catch(err =>
        dispatch({
          type: GET_LOGIN_ERRORS,
          payload: err.response.data
        })
      );
  });
};

export const getUserId = databaseId => dispatch => {
  return new Promise(resolve => {
    axios
      .get("/api/users", { params: { databaseId: databaseId } })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        dispatch({
          type: GET_REGISTER_ERRORS,
          payload: err.response.data
        });
      });
  });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: { decoded: decoded }
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch(resetLoginErrors());
  dispatch(resetRegisterErrors());
};

export const resetLoginErrors = () => {
  return {
    type: GET_LOGIN_ERRORS,
    payload: {}
  };
};

export const resetRegisterErrors = () => {
  return {
    type: GET_REGISTER_ERRORS,
    payload: {}
  };
};
