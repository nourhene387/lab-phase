// redux/reducers/themeReducer.js
const initialState = {
  theme: localStorage.getItem('chat-theme') || 'coffee',  // Default theme is 'coffee'
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
