import { Router } from "express";
import * as controller from "../../controllers/client/song.controller";

const router: Router = Router();

router.get("/topic/:slugTopic", controller.listByTopic);

router.get("/singer/:slugSinger", controller.listBySinger);

router.get("/detail/:slugSong", controller.detail);

router.patch("/like/:typeLike/:idSong", controller.like);

router.patch("/favorite/:typeFavorite/:idSong", controller.favorite);

router.patch("/listen/:idSong", controller.listen);

export const songRoutes: Router = router;