import { Router } from "express";
import * as controller from "../../controllers/client/home.controller";

const router: Router = Router();

router.get("/", controller.home);

export const homeRoutes: Router = router;