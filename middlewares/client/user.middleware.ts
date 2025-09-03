import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

export const infoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if(req.cookies.tokenUser) {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false
    }).select("-password");

     if(user) {
      req["user"] = user;
      res.locals.user = user;
    }
  }

  next();
}