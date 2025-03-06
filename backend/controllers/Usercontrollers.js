// /src/backend/controllers/Usercontrollers.js

import bcrypt from 'bcryptjs';
import User from '../models/user_model.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../db/cloudinary.js';

// Post user (Register)
export const postUsers = async (req, res) => {
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
export const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, username: user.username } };
        const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1d' });

        return res.status(200).json({ message: 'User logged in successfully', user, token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);

        const users = await User.find();
        return res.status(200).json(users);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get user by username
export const getUserByName = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
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

// Add profile picture
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.profilePic = profilePic;
        await user.save();

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            user,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Add to contact list
export const addtolist = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const { friendId } = req.params;

        const my_account = await User.findById(id);
        const user = await User.findOne({ _id: friendId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const contact = my_account.contact;

        const existId = contact.includes(friendId);
        if (existId) {
            return res.status(400).json({ message: 'Contact already exists', user });
        }

        contact.push(friendId);
        await my_account.save();

        return res.status(200).json({ message: 'Contact added successfully', my_account });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get my contact list
export const getcontact = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const user = await User.findById(id).populate("contact");
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const contacts = user.contact;

        if (contacts.length === 0) {
            return res.status(200).json({ message: 'Contact list is empty' });
        }

        return res.status(201).json({ message: 'Contact list', contacts });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Remove contact
export const removeContact = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("userauth:", id);
        const user = await User.findById(id);
        const { contactId } = req.body;

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const contactIndex = user.contact.indexOf(contactId);
        if (contactIndex === -1) {
            return res.status(400).json({ message: 'Contact not found in the list' });
        }

        user.contact.splice(contactIndex, 1);
        await user.save();

        return res.status(200).json({ message: 'Contact removed successfully', user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
};

// Get user by ID
export const getByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update user information
export const updateuser = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("User ID from authentication:", id);

        const { username, email, phone, sexe, dateofbirth, profilePic } = req.body;

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (sexe) user.sexe = sexe;
        if (dateofbirth) user.dateofbirth = dateofbirth;
        if (profilePic) user.profilePic = profilePic;

        await user.save();

        return res.status(200).json({ message: 'User updated successfully', user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
