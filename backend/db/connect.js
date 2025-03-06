import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGO_URI;  // Ensure the environment variable is correctly set

// Connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection error', err);
        process.exit(1); // Exit the process with failure code
    }
};

export default connectDB;
