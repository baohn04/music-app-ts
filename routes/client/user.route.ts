import { Router } from "express";
import * as controller from "../../controllers/client/user.controller";

import * as validate from "../../validates/client/user.validate";

const router: Router = Router();

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost);

router.get("/info", controller.info);

router.patch(
  "/info", controller.infoPatch
);

export const userRoutes: Router = router;