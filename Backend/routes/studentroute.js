import express from "express";
import { authorize, protect } from "../Middleware/auth.js";

import { getMyDetails, getRoommates, StudentLogin } from "../controller/studnetlogic.js";


const Studentrouter=express.Router();


Studentrouter.post("/Login",StudentLogin)

Studentrouter.get("/mydetails",protect,authorize("student"),getMyDetails);
Studentrouter.get("/roommates",protect,authorize("student"),getRoommates);







export default Studentrouter;