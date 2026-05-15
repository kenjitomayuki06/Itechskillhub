import { Router } from "express";
import { loginController } from "../controller/loginControllers/loginController.js";
import { getUserbyIDController } from "../controller/loginControllers/UserbyID.js";
import { getUserbyEmailPassController } from "../controller/loginControllers/UserbyEmailPassController.js";


const loginRouter = Router();


loginRouter.post('/login', getUserbyEmailPassController)
loginRouter.get('/login/:user_id', getUserbyIDController)



export default loginRouter


