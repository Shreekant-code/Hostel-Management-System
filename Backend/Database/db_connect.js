import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_connect=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" ✅ mongodb connection successful");
    } catch (error) {
        console.log(error.message);
        
    }
}


export default db_connect;