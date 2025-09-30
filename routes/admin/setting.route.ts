import { Router } from "express";
import multer from "multer";

import * as controller from "../../controllers/admin/setting.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

const router: Router = Router();

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.uploadSingle,
  controller.generalPatch
);

export const settingGeneralRoutes: Router = router;