import axios from 'axios';
import Cookies from 'js-cookie';

export const loginUser = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });

      const response = await axios.post('/api/users/login', { email, password });

      // Save token to cookies with a 1-day expiration time
      Cookies.set('token', response.data.token, { expires: 1 });

      // Optionally store the user data (if needed)
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });
      Cookies.set('isauth', true);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: response.data.token, user: response.data.user, isauth: true },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };
};

export const logoutUser = () => {
  // Remove token and user data from cookies
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.set('isauth', false)
  return {
    type: 'LOGOUT_USER',
  };
};

// Action to check if the user is authenticated when the app loads
export const checkAuth = () => {
  return (dispatch) => {
    const isAuth = Cookies.get('isauth'); // Check if 'isauth' cookie exists
    if (isAuth) {
      dispatch(setAuth(true)); // If 'isauth' exists, user is authenticated
    } else {
      dispatch(setAuth(false)); // If 'isauth' doesn't exist, user is not authenticated
    }
  };
};

// Action to set authentication status
export const setAuth = (isAuth) => {
  return {
    type: 'SET_AUTH',
    payload: isAuth,
  };
};



export const setcheck = () => {
  return async (dispatch) => {
    try {
      // Dispatch an action indicating the start of the check operation
      dispatch({ type: 'SET_CHECK_REQUEST' });

      // Make the API call
      const response = await axios.get("/api/users/check", {
        withCredentials: true,
      });

      // If successful, dispatch success action
      dispatch({
        type: 'SET_CHECK',
        payload: {
          token: Cookies.get("token"),  // Assuming your API returns a token
          user: response.data.user,    // Assuming your API returns user data
          isAuth: true,                // Authentication flag to indicate user is authenticated
        },
      });

    } catch (error) {
      // Dispatch an action for failure if something goes wrong
      console.error(error);

      const errorMessage = error.response 
        ? error.response.data.message 
        : error.message;

      // Dispatch failure action with error message
      dispatch({
        type: 'SET_CHECK_FAILURE',
        payload: errorMessage,
      });
    }
  };
};
