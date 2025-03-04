// redux/actions/themeAction.js
export const SET_THEME = 'SET_THEME';  // Directly define the action type here

// Action creator to update the theme
export const setTheme = (theme) => {
  return {
    type: SET_THEME,
    payload: theme,
  };
};

// Async action (Redux Thunk) to save the theme to localStorage
export const saveTheme = (theme) => {
  return (dispatch) => {
    localStorage.setItem('chat-theme', theme);
    dispatch(setTheme(theme));
  };
};
