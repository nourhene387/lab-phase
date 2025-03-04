// actions/chatroomActions.js
export const FETCH_MESSAGES = "FETCH_MESSAGES";
export const DELETE_MESSAGE = "DELETE_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_USER_ID = "SET_USER_ID";

export const fetchMessages = (messages) => ({
  type: FETCH_MESSAGES,
  payload: messages,
});

export const deleteMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  payload: messageId,
});

export const updateMessage = (messageId, updatedMessage) => ({
  type: UPDATE_MESSAGE,
  payload: { messageId, updatedMessage },
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});
