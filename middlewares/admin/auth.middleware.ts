import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/config";
import AccountAdmin from "../../models/account-admin.model";
import Role from "../../models/role.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await AccountAdmin.findOne({
      token: req.cookies.token,
    }).select("-password");
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role = await Role.findOne({
        _id: user.role_id
      });
      res.locals.user = user; // Tra ve user bien toan cuc
      res.locals.role = role; 
      next();
    }
  }
}