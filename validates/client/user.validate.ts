import { NextFunction, Request, Response } from "express";

export const registerPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.fullName) {
    // req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.email) {
    // req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.password) {
    // req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(req.body.password != req.body.confirmPassword) {
    // req.flash("error", "Mật khẩu không trùng khớp!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); // Chuyển sang đoạn mã kế tiếp
}

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.email) {
    // req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.password) {
    // req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); // Chuyển sang đoạn mã kế tiếp
}

export const forgotPasswordPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.email) {
    // req.flash("error", "Vui lòng nhập Email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); 
}

export const resetPasswordPost = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.password) {
    // req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(!req.body.confirmPassword) {
    // req.flash("error", "Vui lòng xác nhận mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(req.body.password != req.body.confirmPassword) {
    // req.flash("error", "Mật khẩu không trùng khớp!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next(); 
}