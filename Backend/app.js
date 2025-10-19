import express from "express"
import db_connect from "./Database/db_connect.js";
import Adminroutes from "./routes/adminroutes.js";
const app=express();



await db_connect();
app.use("/admin",Adminroutes);




app.listen(3000,()=>{
    console.log(`Server is running on Port 3000`);
})