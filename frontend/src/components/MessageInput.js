import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Send, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { sendMessage, setImagePreview, removeImagePreview } from "../redux/actions/chatAction";
import axios from "axios";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { imagePreview } = useSelector((state) => state.chat);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    dispatch(setImagePreview(previewUrl)); // Set image preview in Redux store
  };

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Upload image if selected
    const imageUrl = imageFile ? await uploadImage(imageFile) : null;

    // Dispatch send message action
    const messageData = {
      text,
      image: imageUrl || "",
    };

    dispatch(sendMessage(id, messageData));

    // Clear the input fields
    setText("");
    dispatch(removeImagePreview()); // Clear image preview
    setImageFile(null);
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "quickconnect");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dhm1dj6ld/image/upload",
      formData
    );

    return response.data.secure_url;
  };

  // Remove image preview
  const removeImage = () => {
    dispatch(removeImagePreview());
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="message-input">
      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" width="50" height="50" />
          <button onClick={removeImage} type="button">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a message..."
          style={{ width: "60vw" }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <button type="button" onClick={() => fileInputRef.current.click()}>
          <Image size={20} />
        </button>
        <button type="submit" disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
