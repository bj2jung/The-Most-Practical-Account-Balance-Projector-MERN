import axios from "axios";
import {
  GET_ITEMS,
  ADD_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  RESET_ALL_ITEMS
} from "./types";

export const getItems = userId => dispatch => {
  return new Promise(resolve => {
    axios.get("/api/items", { params: { userId: userId } }).then(res => {
      dispatch({
        type: GET_ITEMS,
        payload: res.data[0]
      });
      resolve(res.data[0]);
    });
  });
};

export const addItem = (item, userId) => dispatch => {
  return axios
    .post("/api/items", { item, userId })
    .then(res =>
      dispatch({
        type: ADD_ITEM,
        payload: res.data
      })
    )
    .then(res => res.data);
};

export const editItem = (userId, item) => dispatch => {
  return axios({
    method: "put",
    url: `/api/items/${userId}`,
    data: item
  })
    .then(res =>
      dispatch({
        type: EDIT_ITEM,
        payload: [item.key, res.data]
      })
    )
    .then(res => res.data);
};

export const removeItem = (userId, itemKey) => dispatch => {
  axios
    .delete(`/api/items/${userId}`, { params: { itemKey: itemKey } })
    .then(() =>
      dispatch({
        type: REMOVE_ITEM,
        payload: itemKey
      })
    );
};

export const resetAllItems = userId => dispatch => {
  axios.delete(`/api/items/reset/${userId}`).then(() =>
    dispatch({
      type: RESET_ALL_ITEMS
    })
  );
};
