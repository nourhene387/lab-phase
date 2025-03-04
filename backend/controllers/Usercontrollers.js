const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const cloudinary = require('../db/cloudinary.js')
// Post user (Register)
exports.postUsers = async (req, res) => {
    try {
        const { username, email, password, confirmEmail, confirmPassword, phone, sexe, dateofbirth } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        user = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            sexe,
            dateofbirth

        });


        await user.save();
        const payload = { user: { id: user.id, username: user.username } };
        const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1d' });


        res.status(200).json({ message: "User created successfully", user, token });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", err });
    }
};

// Get user by email (Login)
exports.getUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id, username: user.username } };
        const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1d' });

        return res.status(200).json({ message: 'User logged in successfully', user, token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const { id } = req.user
        //const authuser=await User.find({id})
        console.log("userauth:", id)

        const users = await User.find();
        return res.status(200).json(users);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get user by username
exports.getUserByName = async (req, res) => {

    try {
        const { id } = req.user
        //const authuser=await User.find({id})
        console.log("userauth:", id)
        const { username } = req.body;
        const user = await User.find({ username });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};
//add profilepic
exports.updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const { id } = req.user
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Update the user's profile picture
        user.profilePic = profilePic; // Assuming you are storing the image URL in the 'profilePic' field
        await user.save(); // Save the updated user document

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            user,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }

}
//add  to contact list 
exports.addtolist = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const { friendId } = req.params; // Get the friendId from the URL parameters

        const my_account = await User.findById(id);

        // Use _id to query the User model
        const user = await User.findOne({ _id: friendId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const contact = my_account.contact;

        // Check if the contact already exists in the list
        const existId = contact.includes(friendId);
        if (existId) {
            return res.status(400).json({ message: 'Contact already exists', user });
        }


        // Add the user ID to the contact list
        contact.push(friendId);

        // Save the updated user contact list
        await my_account.save();

        //console.log("Updated user:", my_account);

        return res.status(200).json({ message: 'Contact added successfully', my_account });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
}
//get my contact list 
exports.getcontact = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const user = await User.findById(id).populate("contact")
        console.log(user)
          if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        //console.log("user found")
         const contacts= user.contact;
        //   console.log("contact",contacts)
          if(contacts.length===0){
            return res.status(200).json({message:'contact list is empty'})
          }
           return res.status (201).json({message:'contact list', contacts})
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
}
exports.removeContact = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const user = await User.findById(id)
        const {  contactId } = req.body; // Expecting userId (the logged-in user) and contactId (the contact to remove)
 
  console.log(contactId)
   
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if contact exists in the user's contact list
        const contactIndex = user.contact.indexOf(contactId);
         console.log(contactIndex)
        if (contactIndex === -1) {
            return res.status(400).json({ message: 'Contact not found in the list' });
        }

        // Remove contact from the contact list
        user.contact.splice(contactIndex, 1);

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'Contact removed successfully', user });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};
///

exports.getByID = async (req, res) => {
    try {
        const { id } = req.params; // Destructure the ID from the URL params
        const user = await User.findById(id); // Find the user by ID

        // Check if user is found
        if (!user) {
            return res.status(400).json({ message: "User not found" }); // Return a 400 error if the user is not found
        }

        // Return the found user
        return res.status(200).json(user);

    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "Server error" }); // Return a 500 error if something goes wrong on the server
    }
};
//const User = require('../models/user');  // Assuming the User model is imported here

exports.updateuser = async (req, res) => {
    try {
        // Extract user ID from authenticated user (assuming `req.user` contains authenticated user data)
        const { id } = req.user;
        console.log("User ID from authentication:", id);

        // Retrieve the updated data from the request body
        const { username, email, phone, sexe, dateofbirth, profilePic } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Update the user fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (sexe) user.sexe = sexe;
        if (dateofbirth) user.dateofbirth = dateofbirth;
        if (profilePic) user.profilePic = profilePic;

        // Save the updated user to the database
        await user.save();

        // Return success response
        return res.status(200).json({ message: 'User updated successfully', user });

    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return res.status(500).json({ message: "Server error" });  // Return 500 error if something goes wrong on the server
    }
};
