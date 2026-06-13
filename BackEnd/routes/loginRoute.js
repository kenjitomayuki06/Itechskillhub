import { Router } from "express";
import { loginController } from "../controller/loginControllers/loginController.js";
import { getUserbyIDController } from "../controller/loginControllers/UserbyID.js";
import { getUserbyEmailPassController } from "../controller/loginControllers/UserbyEmailPassController.js";
import { authMeController } from "../controller/loginControllers/authMeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { forgotPasswordController } from '../controller/loginControllers/forgotPasswordController.js';
import { resetPasswordController } from '../controller/loginControllers/resetPasswordController.js';

const loginRouter = Router();


loginRouter.post('/login', getUserbyEmailPassController)
loginRouter.get('/login/:user_id', getUserbyIDController)
loginRouter.get('/me', protect, authMeController);
loginRouter.post('/forgot-password', forgotPasswordController);
loginRouter.post('/reset-password', resetPasswordController);


export default loginRouter


