import React from "react";
import { MessageSquare } from "lucide-react";
import '../styles/Nochat.css';

const NoChatSelected = () => {
  return (
    <div className="no-chat-wrapper">
      <div className="no-chat-container">
        {/* Icon Display */}
        <div className="no-chat-icon-wrapper">
          <MessageSquare className="no-chat-icon" />
        </div>

        {/* Welcome Text */}
        <h2 className="no-chat-heading">Welcome to Chatty!</h2>
        <p className="no-chat-description">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
