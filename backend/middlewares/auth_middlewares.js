// /src/backend/middlewares/auth_middlewares.js

import jwt from 'jsonwebtoken';
import User from '../models/user_model.js'; // Use ES6 import for User model
import cookies from 'cookie-parser'; // Use ES6 import for cookie-parser

/********** */
export const protection = async (req, res, next) => {
    try {
        // The token will now be sent in the Authorization header (Bearer Token)
        const token = req.cookies.token; // Get token from cookies
        console.log("Token from cookies:", token);
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify token and decode it
        const decoded = jwt.verify(token, process.env.jwtSecret);

        // Find the user by decoded token ID (user's ID from JWT payload)
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error', err });
    }
};
