import { useParams } from "react-router-dom";
import ChatHeader from "../components/chatheader";
import MessageInput from "../components/MessageInput";
import NoChatSelected from "../components/Nochat";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Edit, Trash2 } from 'lucide-react'; // Import Lucide icons
import "../styles/chatroom.css";
import { io } from "socket.io-client"; // Import Socket.IO client
import {formatMessageTime}from "../utils"
const Chatroom = () => {
  const { id } = useParams(); // Destructure id from useParams
  const [messages, setMessages] = useState([]); // State to store messages
  const [userId, setUserId] = useState(null); // State to store user ID
  const [selectedMessage, setSelectedMessage] = useState(null); // Store the clicked message
  const [isEditing, setIsEditing] = useState(false); // Track if the message is being edited
  const [editedText, setEditedText] = useState(""); // For storing edited text
  const [socket, setSocket] = useState(null); // Socket state

  // Check if the user is logged in and set the userId from the cookie
  useEffect(() => {
    const user = Cookies.get('user'); // Get the user cookie

    if (user) {
      const parsedUser = JSON.parse(user); // Make sure 'user' cookie is a valid JSON string
      setUserId(parsedUser._id); // Set the userId from the parsed cookie
    }
  }, []); // Empty dependency array ensures this only runs once on component mount

  // Initialize socket connection on component mount
  useEffect(() => {
    const socketIo = io("http://localhost:5001"); // Connect to your backend server
    setSocket(socketIo);

    // Listen for incoming messages
    socketIo.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(messages)
    });

    // Clean up socket connection on component unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);
const handlemessage=()=>{
  axios
  .get(`/api/messages/${id}`)
  .then((res) => {
    setMessages(res.data); // Update state with the fetched messages
  })
  .catch((err) => console.log("Error fetching messages:", err));

}
  // Fetch messages when component mounts
  useEffect(() => {
    if (id) {
    handlemessage()
    }
  }, [id,messages]); // Dependency array should include id to refetch when it changes

  // Handle Delete message
  const handleDeleteMessage = (messageId) => {
    axios
      .delete(`/api/messages/delete/${messageId}`)
      .then((res) => {
        setMessages(messages.filter((msg) => msg._id !== messageId)); // Remove message from state
        setSelectedMessage(null); // Hide buttons after deletion
        // Emit delete event to other clients through socket
        socket.emit("deleteMessage", messageId);
      })
      .catch((err) => console.log("Error deleting message:", err));
  };

  // Handle Update message
  const handleUpdateMessage = (messageId) => {
    if (editedText.trim() === "") {
      alert("Please enter some text to update the message.");
      return;
    }

    axios
      .put(`/api/messages/update/${messageId}`, { text: editedText })
      .then((res) => {
        setMessages(
          messages.map((msg) =>
            msg._id === messageId ? { ...msg, text: editedText } : msg
          )
        );
        setSelectedMessage(null); // Hide buttons after updating
        setIsEditing(false); // Reset editing state
        setEditedText(""); // Clear the input after updating
        // Emit update event to other clients through socket
        socket.emit("updateMessage", { messageId, text: editedText });
      })
      .catch((err) => console.log("Error updating message:", err));
  };

  // Handle sending a new message
  const handleSendMessage = (message) => {
    // Emit the new message to the server via socket
    socket.emit("sendMessage", message);

    // Optionally, also make an axios request if needed to save to the DB
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
     handlemessage()
    }, 2);

    // Cleanup function to clear the timeout when the component is unmounted
    return () => {
      clearTimeout(timeout);
    };
  }, []); 
  return (
    <div className="chatroom-container">
      <ChatHeader />
      
      {/* Render messages here */}
      <div className="messages-list">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={
                message.senderId === userId ? "send_message" : "receive_message"
              }
              onClick={() => setSelectedMessage(message)} // Set selected message on click
            > 
            <p>{formatMessageTime(message.date)}</p>
              <p>{message.text}</p> {/* Display message text */}
              {message.image ? (
                <img src={message.image} alt="Message attachment" style={{width:'50%'}}/>
              ) : null}

              {/* Show buttons if message is selected */}
              {selectedMessage && selectedMessage._id === message._id && (
                <div className="message-actions">
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="action-button"
                  >
                    <Trash2 size={18} /> {/* Delete icon */}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="action-button"
                  >
                    <Edit size={18} /> {/* Edit icon */}
                  </button>
                </div>
              )}

              {/* If editing, show an input to update the message */}
              {isEditing && selectedMessage._id === message._id && (
                <div className="edit-message">
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Edit message..."
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdateMessage(message._id)}
                    className="update-button"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <NoChatSelected />
        )}
    
      </div>
      <MessageInput handleSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chatroom;
