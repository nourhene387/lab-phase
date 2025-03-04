import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/search.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [friends, setFriends] = useState([]); // Initialize as an empty array
  const [friedname, setfriendname] = useState("");
  const [user, setuser] = useState(null); // State for storing the decoded user ID

  const user_cookies = Cookies.get('user');
  
  const navigate = useNavigate();
  useEffect(() => {
    if (user_cookies) {
      const parsedUser = JSON.parse(user_cookies); // Decode the token
      //setuserId(parsedUser.id); // Set the user ID from the decoded token
      console.log('User contact:', parsedUser.contact); // Log user ID for debugging
     console.log('user:',parsedUser)
     setuser(parsedUser)
    }
  }, []); // Run this effect when the token changes or the component mounts

  useEffect(() => {
    // Fetch data when the component mounts
    axios
      .get('/api/users/all')
      .then((res) => {
        setFriends(res.data); // Set the state with the fetched data
      })
      .catch((err) => {
        console.error('Error fetching users:', err); // Handle any error here
      });
  }, []); // Empty dependency array to run only on mount

  const handleSearchChange = (e) => {
    setfriendname(e.target.value);
  };

  const handleSearch = () => {
    axios
      .post("/api/users/search", { "username": friedname })
      .then((res) => setFriends(res.data.user)) // Assuming res.data.user is the array of users
      .catch((err) => console.log(err));
  };

  const handleAdd = (friendId) => {
    axios
      .put(`/api/users/add-to-list/${friendId}`)
      .then((res) => {
        console.log('Successfully added contact:', res.data.my_account);

 Cookies.set("user", JSON.stringify(res.data.my_account), { expires: 1 });
      })
      .catch((err) => {
        console.error('Error adding contact:', err);
      });
  };

  const handleSend = (friendId) => {
    navigate(`/chat/${friendId} `); // Implement your message sending logic here
  };

  return (
    <div className="friend-search-container">
      <h1>Find New Friends</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for friends..."
          value={friedname}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {friends.map((friend) => (
        <div key={friend._id} className="friend-card">
          <img
            className="friend_image"
            src={friend.profilePic || 'images/avatar.png'} // Default image if no profile picture
            alt={friend.username}
          />
          <p>Name: {friend.username}</p>

          {/* Conditionally render button based on whether the user is in the contact list */}
          {user.contact.includes(friend._id) ? (
            <button onClick={() => handleSend(friend._id)}>Send Message</button>
          ) : (
            <button onClick={() => handleAdd(friend._id)}>Add to my contact list</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersList;
