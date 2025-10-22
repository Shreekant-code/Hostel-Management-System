import express from "express"
import { AdminLogin, createStudent ,getAllRooms,getRoomById,getAllStudents,deleteStudent,updateStudent,getStudentById} from "../controller/adminlogic.js";
import { protect,authorize } from "../Middleware/auth.js";
import multer from "multer";
import { refreshAccessToken } from "../Middleware/verifytoken.js";


const storage = multer.memoryStorage();
const upload = multer({ storage });


const Adminroutes=express.Router();







Adminroutes.post("/Login",AdminLogin)
Adminroutes.post("/addstudents",upload.single("image"),protect,authorize("admin"),createStudent)


Adminroutes.get("/students", protect, authorize("admin"), getAllStudents);


Adminroutes.get("/students/:id", protect, authorize("admin"), getStudentById);


Adminroutes.put("/students/:id", protect, authorize("admin"), updateStudent);


Adminroutes.delete("/students/:id", protect, authorize("admin"), deleteStudent);

Adminroutes.post("/refresh", refreshAccessToken);




// getting rooms  related routes 
Adminroutes.get("/rooms", protect, authorize("admin"), getAllRooms);
Adminroutes.get("/rooms/:id", protect, authorize("admin"), getRoomById);




export default Adminroutes;