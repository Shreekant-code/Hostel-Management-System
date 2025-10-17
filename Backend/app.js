import express from "express"
import db_connect from "./Database/db_connect.js";
const app=express();



await db_connect();
app.get("/",(req,res)=>{
    res.send("Server setup done");
})




app.listen(3000,()=>{
    console.log(`Server is running on Port 3000`);
})