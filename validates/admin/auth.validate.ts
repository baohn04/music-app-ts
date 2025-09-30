import { NextFunction, Request, Response } from "express";

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  
  next(); // Chuyển sang đoạn mã kế tiếp
}