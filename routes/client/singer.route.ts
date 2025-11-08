import { Router } from "express";
import * as controller from "../../controllers/client/singer.controller";

const router: Router = Router();

router.get("/", controller.singers);

export const singerRoutes: Router = router;