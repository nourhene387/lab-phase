import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Action for setting user info in the Redux state
export const setUserInfo = (userData) => {
    return {
        type: 'SET_USER_INFO',
        payload: userData,
    };
};

// Action for setting an error message
export const setError = (error) => {
    return {
        type: 'SET_ERROR',
        payload: error,
    };
};

// Action for setting loading state
export const setLoading = (loading) => {
    return {
        type: 'SET_LOADING',
        payload: loading,
    };
};

// Action for setting authentication state (isAuth)
export const setAuth = (isAuth) => {
    return {
        type: 'SET_AUTH',
        payload: isAuth,
    };
};

// New action for handling form submission (sign up)
export const handleSubmit = (userData) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Start loading

        try {
            // Make the API call to register the user
            const response = await axios.post('/api/users/register', userData);
            console.log("User registered successfully:", response.data);

            // Stop loading
            dispatch(setLoading(false));

            // Store the token and user data in cookies
            Cookies.set('token', response.data.token, { expires: 1 }); // Set the token for 1 day
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 }); // Store the user info in cookies
            Cookies.set('isauth',JSON.stringify (true), { expires: 1 }); // Store isauth in cookies for 1 day

            // Dispatch the user info to the Redux store
            dispatch(setUserInfo(response.data.user));

            // Set the authentication state to true
            dispatch(setAuth(true)); // User is now authenticated

        } catch (err) {
            console.log("Error during registration:", err.response?.data || err.message);

            // Dispatch error message to Redux store
            dispatch(setError("Failed to register, please check your inputs."));
            dispatch(setLoading(false)); // Stop loading
        }
    };
};

export const UPLOAD_PIC = (image) => {
    return async (dispatch) => {
      try {
        // Create FormData and append the image to it
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', "quickconnect");
  
        // Upload image to Cloudinary
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dhm1dj6ld/image/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        // Get the URL of the uploaded image
        const virtual_url = response.data.secure_url;
        console.log(virtual_url);
  
        // Update user's profile picture in the database
        await axios.put("/api/users/update", { profilePic: virtual_url }, {
          withCredentials: true
        });
  
        console.log("Profile picture updated successfully.");
        toast.success("Profile picture updated successfully.")
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  }
  