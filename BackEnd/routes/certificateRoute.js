import {Router} from "express";
import {getCertificates} from "../controller/StudentController/certificateController.js";
import {protect} from "../middleware/authMiddleware.js";

const certificateRouter = Router();

certificateRouter.get("/certificates", protect, getCertificates);

export default certificateRouter;
