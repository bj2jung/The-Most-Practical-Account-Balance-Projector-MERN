import {
  GET_STARTBALANCE,
  UPDATE_STARTBALANCE,
  RESET_ALL_STARTBALANCE
} from "../actions/types";

const initialState = {
  startBalance: []
  //   loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STARTBALANCE:
      return {
        startBalance: action.payload
      };
    case UPDATE_STARTBALANCE:
      return {
        startBalance: action.payload
      };
    case RESET_ALL_STARTBALANCE:
      return {
        startBalance: []
      };

    default:
      return state;
  }
}
