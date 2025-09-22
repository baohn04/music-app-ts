import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.fullName) {
    req.flash("error", "Vui lòng nhập tên ca sĩ!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  
  next(); // Chuyển sang đoạn mã kế tiếp
}