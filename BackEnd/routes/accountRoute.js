import { Router } from "express";
import { addAccountController } from "../controller/AccountsController/AddAccountControllers.js";
import { deleteAccountController } from "../controller/AccountsController/deleteAccountController.js";
import { updateAccountController } from "../controller/AccountsController/updateAccountController.js";
import { verifyEmailController } from "../controller/AccountsController/verifyEmailController.js";
import { resendVerificationController } from "../controller/AccountsController/resendVerificationController.js";
const registerRouter = Router();

registerRouter.post('/auth/register', addAccountController)
registerRouter.delete('/auth/deleteAccount/:user_Id', deleteAccountController)
registerRouter.put('/auth/updateAccount/:user_Id', updateAccountController)
registerRouter.post('/auth/verify-email', verifyEmailController);
registerRouter.post('/auth/resend-verification', resendVerificationController);

export default registerRouter;