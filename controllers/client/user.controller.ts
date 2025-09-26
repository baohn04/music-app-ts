import { Request, Response } from "express";
import md5 from "md5";
import User from "../../models/user.model";
import * as generate from "../../helpers/generate";
import ForgotPassword from "../../models/forgot-password.model";
import sendMail from "../../helpers/sendMail";

// [GET] /users/register
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/users/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existEmail) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect(req.get("Referrer") || "/");
      return;
    } else {
      req.body.password = md5(req.body.password);
      req.body.token = generate.generateRandomString(20);

      const user = new User(req.body);
      await user.save();
      
      res.cookie("tokenUser", user.token);

      req.flash("success", "Đăng ký thành công!");
      res.redirect("/");
    }
  } catch (error) {
    res.send("Page 404");
  }
};

// [GET] /users/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/users/login.pug", {
    pageTitle: "Đăng ký tài khoản"
  });
};

// [POST] /users/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      // req.flash("error", "Email không tồn tại!");
      res.redirect(req.get("Referrer") || "/");
      return;
    }

    if (md5(password) != user.password) {
      // req.flash("error", "Sai mật khẩu!");
      res.redirect(req.get("Referrer") || "/");
      return;
    }

    //Đăng nhập thành công
    res.cookie("tokenUser", user.token);
    res.redirect("/");
  } catch (error) {
    res.send("Page 404");
  }
};

// [GET] /users/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /users/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /users/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    // req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Lưu data otp vào database
  const otp = generate.generateRandomNumber(6);
  const timeExpire = 3; // thoi gian het han 3 phut

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire*60*1000
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Gửi otp qua email user
  const  subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    OTP là: <b>${otp}</b>. Thời hạn sử dụng là ${timeExpire} phút!
  `;
  sendMail(email, subject, html);

  res.redirect(`/users/password/otp?email=${email}`);
};

// [GET] /users/password/otp
export const otpPassword = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("client/pages/users/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email: email
  });
};

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    // req.flash("error", "OTP không hợp lệ!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.token);

  res.redirect("/users/password/reset");
}

// [GET] /users/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
}

// [POST] /users/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  const user = await User.findOne({
    token: tokenUser
  });

  if(md5(password) === user.password) {
    // req.flash("error", "Vui lòng nhập mật khẩu khác với mật khẩu cũ!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  await User.updateOne({
    token: tokenUser,
  }, {
    password: md5(password)
  });

  // req.flash("success", "Đổi mật khẩu thành công");
  res.redirect("/");
}