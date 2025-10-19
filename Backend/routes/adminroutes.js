import express from "express"
import { AdminLogin } from "../controller/adminlogic.js";

const Adminroutes=express.Router();




Adminroutes.post("/Login",AdminLogin)

export default Adminroutes;