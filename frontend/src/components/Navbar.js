import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Search,user } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/authActions"; // Make sure to import logoutUser
import "../styles/Navbar.css";


const Navbar = () => {
  const dispatch = useDispatch();  // Initialize dispatch function
  const navigate = useNavigate(); // Correctly calling useNavigate as a hook inside a functional component

  const handleLogout = () => {
    
    dispatch(logoutUser());

    // Redirect to the login page
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">
                <img
                  src="/images/quick_connect_logo.jpg"
                  alt="Quick Connect Logo"
                  style={{ width: "100px" }}
                />
              </div>
            </Link>
          </div>

          <div className="navbar-right">
          <Link to={"/contact"} className="nav-link">
              <User className="icon-small" />
              <span className="nav-link-text">contact</span>
            </Link>
            <Link to={"/Search"} className="nav-link">
              <Search className="icon-small" />
              <span className="nav-link-text">Find New Friend</span>
            </Link>
            <Link to={"/settings"} className="nav-link">
              <Settings className="icon-small" />
              <span className="nav-link-text">Settings</span>
            </Link>

            <Link to={"/profile"} className="nav-link">
              <User className="icon-small" />
              <span className="nav-link-text">Profile</span>
            </Link>

            {/* Logout button */}
            <button className="nav-link" onClick={handleLogout}>
              <LogOut className="icon-small" />
              <span className="nav-link-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
