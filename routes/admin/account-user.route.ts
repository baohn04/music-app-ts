import { Router } from "express";
import multer from "multer";

import * as controller from "../../controllers/admin/account-user.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as validate from "../../validates/admin/account-admin.validate"

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-status/:status/:id", controller.changeStatus);

export const accountUserRoutes: Router = router;
