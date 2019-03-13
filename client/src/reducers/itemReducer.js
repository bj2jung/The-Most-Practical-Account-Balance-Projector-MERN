import {
  GET_ITEMS,
  ADD_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  RESET_ALL_ITEMS
} from "../actions/types";

const initialState = {
  items: []
  //   loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        currentKey: action.payload.currentKey
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case EDIT_ITEM:
      const itemIndex = state.items.findIndex(
        item => item._id === action.payload[0]
      );
      state.items[itemIndex] = action.payload[1];
      return {
        ...state,
        items: state.items
      };
    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    case RESET_ALL_ITEMS:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
}
