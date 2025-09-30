import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { uploadRoutes } from "./upload.route";
import { error404Routes } from "./error-404.route";
import { singerRoutes } from "./singer.route";
import { accountAdminRoutes } from "./account-admin.route";
import { roleRoutes } from "./role.route";
import { authRoutes } from "./auth.route";

import * as authController from "../../controllers/admin/auth.controller";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.get(PATH_ADMIN, authController.login);

  app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);

  app.use(`${PATH_ADMIN}/topics`, authMiddleware.requireAuth, topicRoutes);

  app.use(`${PATH_ADMIN}/singers`, authMiddleware.requireAuth, singerRoutes);

  app.use(`${PATH_ADMIN}/songs`, authMiddleware.requireAuth, songRoutes);

  app.use(`${PATH_ADMIN}/upload`, uploadRoutes);

  app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRoutes);

  app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountAdminRoutes);

  app.use(`${PATH_ADMIN}/auth`, authRoutes);

  app.use(`${PATH_ADMIN}/404-not-found`, error404Routes);
};

export default adminRoutes;