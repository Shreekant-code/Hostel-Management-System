import express from "express"
import db_connect from "./Database/db_connect.js";
import Adminroutes from "./routes/adminroutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
const app=express();
dotenv.config();
app.use(
  cors({
    origin: true, 
    credentials: true, 
  })
);


app.use(cookieParser());



await db_connect();
app.use(express.json());
app.use("/admin",Adminroutes);




app.listen(3000,()=>{
    console.log(`Server is running on Port 3000`);
})