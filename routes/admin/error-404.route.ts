import { Router } from "express";

import * as controller from "../../controllers/admin/error-404.controller";

const router: Router = Router();

router.get("/", controller.index);

export const error404Routes: Router = router;
