import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
import { userRoutes } from "./user.route";

import * as authMiddleware from "../../middlewares/client/auth.middleware";
import * as userMiddleware from "../../middlewares/client/user.middleware";

const clientRoutes = (app: Express): void => {
  app.use(userMiddleware.infoUser);

  app.use("/topics", topicRoutes);

  app.use("/songs", songRoutes);
  
  app.use("/favorite-songs", authMiddleware.requireAuth, favoriteSongRoutes);

  app.use("/search", searchRoutes);

  app.use("/users", userRoutes);
};

export default clientRoutes;