import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);
  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Quản lý phân quyền",
    records: records
  });
}

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Thêm mới nhóm quyền",
  });
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const records = new Role(req.body);
    await records.save();
    req.flash("success", "Thêm nhóm quyền thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Thêm nhóm quyền không thành công!"); 
  }
}

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    let find = {
      _id: id,
      deleted: false
    }
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
}

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật nhóm quyền thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền không thành công!");
  }

  res.redirect(req.get("Referrer") || "/");
}

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records
  });
}

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  const permissions = JSON.parse(req.body.permissions);
  for(const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  req.flash("success", "Cập nhật phân quyền thành công!");
  res.redirect(req.get("Referrer") || "/");
}