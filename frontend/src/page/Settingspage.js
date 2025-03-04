import { Send } from "lucide-react";
import { THEMES } from '../constants';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_THEME } from "../redux/actions/themeAction";
import '../styles/settingsPage.css';

// Sample message data for preview
const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  
  // Access the current theme from Redux
  const currentTheme = useSelector((state) => state.theme.theme);

  // Initialize local theme state with Redux state
  const [theme, setTheme] = useState(currentTheme);

  // Update Redux state and local theme state when a new theme is selected
  const handleThemeChange = (selectedTheme) => {
    dispatch({ type: SET_THEME, payload: selectedTheme });  // Dispatch action to update Redux state
    setTheme(selectedTheme);  // Update local theme state
    localStorage.setItem('chat-theme', selectedTheme);  // Save theme to localStorage for persistence
  };

  useEffect(() => {
    // Set the theme when the component mounts, in case it's stored in localStorage
    if (!theme) {
      const themeFromLocalStorage = localStorage.getItem('chat-theme') || 'coffee';
      setTheme(themeFromLocalStorage);
    }
  }, [theme]);

  return (
    <div className="settings-container">
      <div className="theme-section">
        <div className="theme-header">
          <h2>Theme</h2>
          <p>Choose a theme for your chat interface</p>
        </div>

        <div className="theme-options">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`theme-button ${theme === t ? "active-theme" : ""}`}
              onClick={() => handleThemeChange(t)}  // Update the theme on button click
            >
              <div className={`theme-preview theme-${t}`} />
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <h3>Preview</h3>
        <div className="chat-preview">
          <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="user-avatar">J</div>
              <div className="user-info">
                <h3>John Doe</h3>
                <p>Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isSent ? "sent" : "received"}`}
                >
                  <div
                    className={`message-bubble ${message.isSent ? "sent-bubble" : "received-bubble"}`}
                  >
                    <p>{message.content}</p>
                    <p className={`message-time ${message.isSent ? "sent-time" : "received-time"}`}>
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <input
                type="text"
                className="input-field"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
              />
              <button className="send-button">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
