import Cookies from 'js-cookie';

const initialState = {
  user: null, // Initially no user is logged in
  token: null,
  loading: false,
  error: null,
  isAuth: false, // Track the authentication status
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      // Save token and authentication flag to cookies and set user data from the action payload
      Cookies.set('token', action.payload.token, { expires: 1 }); // Token expires in 1 day
      Cookies.set('user', JSON.stringify(action.payload.user), { expires: 1 });
      Cookies.set('isauth', true, { expires: 1 }); // Set isauth to true
      return {
        ...state,
        loading: false,
        user: action.payload.user, // Set user data from payload
        token: action.payload.token, // Set token from payload
        isAuth: true, // Set authentication state
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT_USER':
      // Clear token, user data, and authentication flag on logout
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.set('isauth',false);
      return {
        ...state,
        user: null,
        token: null,
        isAuth: false, // Set isAuth to false
      };

    case 'SET_AUTH':
      return {
        ...state,
        isAuth: action.payload,
      };
       case'SET_CHECK':
       return{
        ...state,
        loading: false,
        user: action.payload.user, // Set user data from payload
        token: action.payload.token, // Set token from payload
        isAuth: true, 
       }
    default:
      return state;
  }
};


export default authReducer;
