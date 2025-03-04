import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { X  } from "lucide-react"; // Use 'User' for the icon
import axios from "axios";
 import '../styles/chatheader.css'
const ChatHeader = () => {
  const { id } = useParams(); // Destructure id from the useParams hook
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate()
  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/contact/${id}`);
        setUserData(response.data); // Set the user data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]); // Re-fetch when 'id' changes

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (!userData) {
    return <div>No user found.</div>; // Show this if no user is found or there is an error
  }

  return (
    <div className="chat-header">
      <div className="avatar">
        <div className="size-10 rounded-full relative">
          {/* Use userData.profilePic or fallback to a default avatar */}
          <img
            src={userData.profilePic || "/images/avatar.png"}
            alt={userData.username}
            className="object-cover w-10 h-10 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1>{userData.username}</h1> {/* Display the user's name */}
       
      </div>
      <div>
          <button
            onClick={() => navigate('/contact')}
            className="text-red-500"
          >
            <X size={20} /> {/* Close button using the 'X' icon from Lucide */}
          </button>
        </div>
    </div>
  );
};

export default ChatHeader;
