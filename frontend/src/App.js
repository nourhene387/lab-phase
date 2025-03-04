import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './page/login';
import SignUp from './page/signup';
import ProfilePage from './page/ProfilePage';
import { Toaster } from "react-hot-toast";
import SettingsPage from './page/Settingspage';
import Navbar from './components/Navbar';

import Search from "./page/searchPage";

import ProfilePic from './components/profilepic';
import ChatRoom from './page/chatroom';
import ContactList from './page/contactlist';
import { setcheck } from "./redux/actions/authActions"
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {theme} from './redux/actions/themeAction'
function App() {
  //const dispatch=useDispatch()
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth)
  console.log(isAuth)
  useEffect(() => {
    // dispatch(checkAuth)
    dispatch(setcheck())
  }, [isAuth])
  console.log(isAuth)
  return (

    <div>

      {isAuth ? <Navbar /> : null}
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path='/upload'
          element={isAuth ? <ProfilePic /> : <Navigate to="/" />}
        />
        <Route path='/profile'
         element={isAuth ? < ProfilePage /> : <Navigate to="/" />} />
        <Route path='/search' 
        element={isAuth ? <Search />: <Navigate to="/" />} />

        <Route path='/settings'
         element={isAuth ? < SettingsPage />: <Navigate to="/" />} />
        <Route path='/contact'
         element={isAuth ?<ContactList />: <Navigate to="/" />} />
        <Route path='/chat/:id'
         element={ <ChatRoom />} />

      </Routes>
      <Toaster />
    </div>

  );
}

export default App;
