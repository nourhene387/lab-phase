import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SET_IMAGE_PREVIEW,
  REMOVE_IMAGE_PREVIEW,
} from "../actions/chatAction";

// Initial state
const initialState = {
  sendingMessage: false,
  messageError: null,
  messages: [],
  imagePreview: null,
};

// Reducer function
const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      return { ...state, sendingMessage: true, messageError: null };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sendingMessage: false,
        messages: [...state.messages, action.payload], // Add the sent message to the state
      };

    case SEND_MESSAGE_FAILURE:
      return { ...state, sendingMessage: false, messageError: action.payload };

    case SET_IMAGE_PREVIEW:
      return { ...state, imagePreview: action.payload };

    case REMOVE_IMAGE_PREVIEW:
      return { ...state, imagePreview: null };

    default:
      return state;
  }
};

export default chatReducer;
