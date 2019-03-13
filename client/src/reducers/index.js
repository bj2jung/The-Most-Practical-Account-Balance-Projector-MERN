import { combineReducers } from "redux";
import itemReducer from "./itemReducer";
import startBalanceReducer from "./startBalanceReducer";
import authReducer from "./authReducer";
import loginErrorReducer from "./loginErrorReducer";
import registerErrorReducer from "./registerErrorReducer";

export default combineReducers({
  startBalance: startBalanceReducer,
  item: itemReducer,
  auth: authReducer,
  loginErrors: loginErrorReducer,
  registerErrors: registerErrorReducer
});
