import { Request, Response } from "express";
import AccountAdmin from "../../models/account-admin.model";
import Role from "../../models/role.model";
import md5 from "md5";
import * as generate from "../../helpers/generate";
import { systemConfig } from "../../config/config";
import convertToSlug from "../../helpers/convertToSlug";
import filterStatusHelper from "../../helpers/filterStatus";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  let find = {
    deleted: false
  };

  // Filter Status
  const filterStatus = filterStatusHelper(req.query);

  if(req.query.status) {
    find["status"] = req.query.status.toString();
  }
  // End Filter Status

  // Search
  const keyword: string = req.query.keyword as string;

  if (keyword && req.query.keyword !== "undefined") {
    const keywordRegex = new RegExp(keyword, "i");

    // convert to slug Ex: Cắt Đôi --> Cat-Doi --> cat-doi
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i"); 
    
    // key $or trong object find dùng để search theo title hoặc slug
    find["$or"] = [
      { fullName: keywordRegex }, 
      { slug: stringSlugRegex }
    ];
  }
  // End Search

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 4,
  }

  const countTopics = await AccountAdmin.countDocuments(find);
  const objectPagination = paginationHelper(initPagination, req.query, countTopics);
  // End Pagination

  const records = await AccountAdmin.find(find).select("-password -token").limit(objectPagination.limitItems).skip(objectPagination.skip);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record["role"] = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Quản lý tài khoản",
    records: records,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Thêm mới tài khoản",
    roles: roles
  });
};

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const emailExist = await AccountAdmin.findOne({
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
        password: string,
        phone: string,
        role_id: string,
        status: string,
        avatar?: string,
        token: string
      };

      const dataAcount: dataAcount = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        phone: req.body.phone,
        role_id: req.body.role_id,
        status: req.body.status,
        token: generate.generateRandomString(20)
      };

      if(req.body.avatar) {
        dataAcount["avatar"] = req.body.avatar;
      }

      const records = new AccountAdmin(dataAcount);
      await records.save();
      req.flash("success", "Tạo tài khoản thành công!");
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    req.flash("error", "Tạo tài khoản không thành công!");
  }
};

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const data = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

    const roles = await Role.find({
      deleted: false
    });
  
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    
    const emailExist = await AccountAdmin.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });

    console.log(emailExist);

    if(emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect(req.get("Referrer") || "/");
    } else {
      interface dataAcount {
        fullName: string,
        email: string,
        password?: string,
        phone: string,
        role_id: string,
        status: string,
        avatar?: string,
      };

      const dataAcount: dataAcount = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        role_id: req.body.role_id,
        status: req.body.status
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

// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await AccountAdmin.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa account thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status: string = req.params.status;
  const id: string = req.params.id;

  console.log(status);
  console.log(id);

  await AccountAdmin.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect(req.get("Referrer") || "/");
};