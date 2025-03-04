const mongoose=require('mongoose');
require('dotenv').config();
MONGODB_URI=process.env.MongoDB_URI;

//connect database
 const connectDB= async()=>{
    try{
        await mongoose.connect(MONGODB_URI)
        console.log('Database connection successful');

    }catch(err){
        console.error('Database connection error', err);
  process.exit(1);

    }
 }
module.exports=connectDB