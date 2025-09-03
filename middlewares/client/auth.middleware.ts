import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.cookies.tokenUser) {
    return res.redirect(`/users/login`);
  }

  const user = await User.findOne({
    token: req.cookies.tokenUser,
    deleted: false
  });

  if (!user) {
    return res.redirect(`/users/login`);
  }

  next();
}