import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.description) {
    req.flash("error", "Vui lòng nhập mô tả!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  
  next(); // Chuyển sang đoạn mã kế tiếp
}