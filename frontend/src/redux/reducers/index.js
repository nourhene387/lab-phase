// /C:/Users/ASUS/Desktop/real time chat/frontend/src/redux/reducers/index.js

import { combineReducers } from "redux";
import userReducer from "./userReducer";
 import authReducer from './authReducer'
import chatReducer from "./chatReducers";
import themeReducer from './themeReducer'
import chatroomReducer from "./chatroomReducers";
const rootReducer = combineReducers({
 user: userReducer,
 auth:authReducer,
 chat:chatReducer,
 chatroom:chatroomReducer,
theme:themeReducer,

});

export default rootReducer;
