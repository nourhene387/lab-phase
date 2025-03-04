import React, { useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { UPLOAD_PIC } from "../redux/actions/userActions"; // Ensure you use the action creator here
import '../styles/profilepic.css';  
import '../App.css'
import { useNavigate } from "react-router-dom";
 
const Profilepic = () => {
  const [image, setImage] = useState(null); 
  const [pic, setpic] = useState(null);
  const dispatch = useDispatch();
   const Navigate=useNavigate()

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    if (e.target.files[0]) {
      setpic(URL.createObjectURL(e.target.files[0])); // Update image preview
    }
  };

  const token = Cookies.get('token');
  console.log('Token:', token);
 const navigate=useNavigate()
  const handleUpload = async () => {
    if (image) {
      dispatch(UPLOAD_PIC(image)); // Dispatch the action to upload the image
    navigate('/search')
    } else {
      console.log('No image selected');
    }
  };

  return (
    <div className="profilepic-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}  // Corrected to onChange
      />
      <img 
        src={image ? pic : "/images/avatar.png"} // If image is selected, use it, else fallback to default image
        alt="Profile Preview"
        width="200"
        height="200"
      />
      <div className="button_section">
      <button onClick={handleUpload} className="upload_button">Upload</button>
      <button className="ignore_button" onClick={ ()=>Navigate('/Search')}>ignore</button>
      </div>
    </div>
  );
};

export default Profilepic;
