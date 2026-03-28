import {Router} from "express"
import { AuthController } from "./auth.controller";
import { container } from "../../config/container";

const authRouter = Router()
const authController = container.resolve<AuthController>('authController');

authRouter.post("/sign-up",authController.register);
authRouter.post("/sign-in",authController.login);


export default authRouter;