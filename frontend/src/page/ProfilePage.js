import { useState, useEffect } from "react";
import { Camera, Mail, User, Calendar } from "lucide-react";
import Cookies from 'js-cookie';
import '../styles/Profilpage.css';
import { formatDate } from '../utils';
import axios from "axios";

const ProfilePage = () => {
  const [authUser, setAuthUser] = useState({
    username: "",
    email: "",
    dateofbirth: "",
    memberSince: "",
    sexe: '',
    profilePic: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  // Load user from cookies on component mount
  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setAuthUser(parsedUser);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdatingProfile(true);  // Disable input while uploading
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "quickconnect");

    try {
      // Upload image to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dhm1dj6ld/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const virtual_url = response.data.secure_url; // Get the URL of the uploaded image
      setAuthUser((prevState) => ({
        ...prevState,
        profilePic: virtual_url,
      }));
      setSelectedImg(virtual_url); // Set the selected image
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUpdatingProfile(false); // Enable input after upload
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle save profile changes
  const handleSave = () => {
    setIsUpdatingProfile(true); // Disable inputs while saving
    axios
      .put("/api/users/updateprof", authUser)
      .then((res) => {
        // After profile is updated, save the updated user in cookies
        setAuthUser(res.data); // Update the state with the response
        Cookies.set('user', JSON.stringify(res.data.user), { expires: 1 });
        setIsUpdatingProfile(false); // Enable inputs after saving
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setIsUpdatingProfile(false); // Enable inputs if there's an error
      });
  };

  // Determine the profile picture to display
  const getProfilePic = () => {
    if (authUser.profilePic || selectedImg) {
      return selectedImg || authUser.profilePic;
    } else {
      return "/images/avatar.png" ;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-title">
            <h1>Profile</h1>
            <p>Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="avatar-upload">
            <div className="avatar-container">
              <img
                src={getProfilePic()} // Dynamically get the profile picture
                alt="Profile"
                className="avatar-image"
              />
              <label
                htmlFor="avatar-upload"
                className={`upload-button ${isUpdatingProfile ? "update-pulse" : ""}`}
              >
                <Camera className="camera-icon" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className={isUpdatingProfile ? "uploading" : ""}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile Information */}
          <div className="profile-info">
            {/* Full Name */}
            <div className="info-group">
              <div className="info-label">
                <User className="icon" />
                Full Name
              </div>
              <input
                type="text"
                name="username"
                value={authUser.username}
                onChange={handleInputChange}
                className="info-content"
                disabled={isUpdatingProfile}
              />
            </div>

            {/* Email Address */}
            <div className="info-group">
              <div className="info-label">
                <Mail className="icon" />
                Email Address
              </div>
              <input
                type="email"
                name="email"
                value={authUser.email}
                onChange={handleInputChange}
                className="info-content"
                disabled={isUpdatingProfile}
              />
            </div>

            {/* Date of Birth */}
            <div className="info-group">
              <div className="info-label">
                <Calendar className="icon" />
                Date of Birth
              </div>
              <input
                type="text"
                name="dateofbirth"
                value={formatDate(authUser.dateofbirth)}
                onChange={handleInputChange}
                className="info-content"
                disabled={isUpdatingProfile}
              />
            </div>

            {/* Sex */}
            <div className="info-group">
              <div className="info-label">
                <Calendar className="icon" />
                Sex
              </div>
              <input
                type="text"
                name="sexe"
                value={authUser.sexe}
                onChange={handleInputChange}
                className="info-content"
                disabled={isUpdatingProfile}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="account-info">
            <h2>Account Information</h2>
            <div className="status-row">
              <span>Member Since</span>
              <span>{authUser.memberSince || "Loading..."}</span>
            </div>
            <div className="status-row">
              <span>Account Status</span>
              <span className="status">Active</span>
            </div>
          </div>

          {/* Save button */}
          <div className="save-button">
            <button onClick={handleSave} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
