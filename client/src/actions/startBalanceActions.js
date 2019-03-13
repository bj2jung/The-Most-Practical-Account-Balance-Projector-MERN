import axios from "axios";
import {
  GET_STARTBALANCE,
  UPDATE_STARTBALANCE,
  RESET_ALL_STARTBALANCE
} from "./types";

export const getStartBalance = userId => dispatch => {
  return new Promise(resolve => {
    axios.get("/api/startBalance", { params: { userId: userId } }).then(res => {
      dispatch({
        type: GET_STARTBALANCE,
        payload: res.data[0].startBalance
      });
      resolve(res.data[0].startBalance);
    });
  });
};

export const updateStartBalance = (startBalance, userId) => dispatch => {
  axios.post("/api/startBalance", { startBalance, userId }).then(res => {
    dispatch({
      type: UPDATE_STARTBALANCE,
      payload: res.data
    });
  });
};

export const resetAllStartBalance = userId => dispatch => {
  axios.delete(`/api/startBalance/${userId}`).then(() => {
    dispatch({
      type: RESET_ALL_STARTBALANCE
    });
  });
};
