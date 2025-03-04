// reducers/chatroomReducers.js
import {
  FETCH_MESSAGES,
  DELETE_MESSAGE,
  UPDATE_MESSAGE,
  ADD_MESSAGE,
  SET_USER_ID,
} from "../actions/chatroomActions";

const initialState = {
  messages: [],
  userId: null,
};

const chatroomReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message._id !== action.payload
        ),
      };

    case UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((message) =>
          message._id === action.payload.messageId
            ? { ...message, text: action.payload.updatedMessage }
            : message
        ),
      };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };

    default:
      return state;
  }
};

export default chatroomReducer;
