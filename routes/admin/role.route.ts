import { Router } from "express";
import * as controller from "../../controllers/admin/role.controller";
import * as validate from "../../validates/admin/role.validate"

const router: Router = Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

export const roleRoutes: Router = router;
