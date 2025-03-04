

 import axios from "axios";
// Define Action Types for message sending and image preview management
export const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
export const SET_IMAGE_PREVIEW = "SET_IMAGE_PREVIEW";
export const REMOVE_IMAGE_PREVIEW = "REMOVE_IMAGE_PREVIEW";


// Send message action
export const sendMessage = (chatId, messageData) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });

  try {
    const response = await axios.post(`/api/messages/send/${chatId}`, messageData, {
      headers: {
        withCredentials: true,
      },
    });

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: response.data, // Adjust based on API response structure
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      payload: error.message,
    });
  }
};

// Set image preview (when selecting an image)
export const setImagePreview = (imageUrl) => {
  return {
    type: SET_IMAGE_PREVIEW,
    payload: imageUrl,
  };
};

// Remove image preview (when removing an image)
export const removeImagePreview = () => {
  return {
    type: REMOVE_IMAGE_PREVIEW,
  };
};
