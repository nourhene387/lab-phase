import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/contactlist.css';  // Import the new CSS file

const ContactList = () => {
  const [contacts, setContacts] = useState([]); // Initialize contacts state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the contact list data from the API
    axios.get('/api/users/contact')
      .then((res) => {
        console.log(res.data); // Logging the data received from API
        setContacts(res.data.contacts); // Set the state with the contact list data
      })
      .catch((err) => console.log(err)); 
      
  }, []); // Empty dependency array to run once when the component mounts
  if(!contacts){
    navigate(`/search`);
  }
  const handleSend = (contactId) => {
    // Navigate to the chat page with the contact's ID
    navigate(`/chat/${contactId}`);
  };

  const handleRemove = (contactId) => {
    axios.post("/api/users/remove-contact", { contactId })
      .then((res) => {
        console.log(res.data.message); // Success message
        // Optionally, update the contact list state after successful removal
        setContacts((prevContacts) => prevContacts.filter(contact => contact._id !== contactId));
      
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Contact List</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for friends..."
          value=''
          
        />
        <button onClick>Search</button>
      </div>
      {contacts ? (
        <div className="contact-list-container">
          {contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <img
                src={contact.profilePic || '/images/avatar.png'} // Correct image source logic
                alt={contact.username}
              />
              <div className="contact-card-body">
                <h4>{contact.username}</h4>
                <div className="button-container">
                  <button onClick={() => handleSend(contact._id)}>Chat</button>
                  <button className="remove" onClick={() => handleRemove(contact._id)}>Remove from list</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-contacts">No contacts found.</p>
      )}
    </div>
  );
};

export default ContactList;
