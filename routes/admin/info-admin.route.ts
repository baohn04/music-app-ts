import { Router } from "express";
import multer from "multer";

import * as controller from "../../controllers/admin/info-admin.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.get("/edit/", controller.edit);

router.patch(
  "/edit/",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

export const infoAdminRoutes: Router = router;
