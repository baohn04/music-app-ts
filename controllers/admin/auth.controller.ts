import { Request, Response } from "express";
import { systemConfig } from "../../config/config";
import AccountAdmin from "../../models/account-admin.model";
import md5 from "md5";

// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  if(req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
}

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await AccountAdmin.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  if(user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}