import { Request, Response } from "express";
import AccountAdmin from "../../models/account-admin.model";
import md5 from "md5";

// [GET] /admin/info-admin
export const index = async (req: Request, res: Response) => {
  res.render("admin/pages/info-admin/index.pug", {
    pageTitle: "Thông tin cá nhân"
  });
};

// [GET] /admin/info-admin/edit
export const edit = async (req: Request, res: Response) => {
  res.render("admin/pages/info-admin/edit.pug", {
    pageTitle: "Cập nhật thông tin cá nhân"
  });
};

// [PATCH] /admin/info-admin/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = res.locals.user.id;
    
    const emailExist = await AccountAdmin.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });

    if(emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect(req.get("Referrer") || "/");
    } else {
      interface dataAcount {
        fullName: string,
        email: string,
        password?: string,
        phone: string,
        avatar?: string,
      };

      const dataAcount: dataAcount = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone
      };

      if(req.body.password) {
        dataAcount["password"] = md5(req.body.password);
      } else {
        delete req.body.password;
      }

      if(req.body.avatar) {
        dataAcount["avatar"] = req.body.avatar;
      }

      await AccountAdmin.updateOne({ _id: id }, dataAcount);
      req.flash("success", "Cập nhật thành công!");
      res.redirect(req.get("Referrer") || "/");
    }
  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }
};