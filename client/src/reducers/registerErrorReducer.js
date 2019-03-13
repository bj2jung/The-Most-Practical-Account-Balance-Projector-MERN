// import { GET_LOGIN_ERRORS } from "../actions/types";
import { GET_REGISTER_ERRORS } from "../actions/types";
// import { GET_ERRORS } from "../actions/types";
const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    // case GET_LOGIN_ERRORS:
    //   return action.payload;
    case GET_REGISTER_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
