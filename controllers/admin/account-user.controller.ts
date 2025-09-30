import { Request, Response } from "express";
import md5 from "md5";
import filterStatusHelper from "../../helpers/filterStatus";
import convertToSlug from "../../helpers/convertToSlug";
import paginationHelper from "../../helpers/pagination";
import User from "../../models/user.model";
import { systemConfig } from "../../config/config";

// [GET] /admin/users
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

    // convert to slug
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

  const countTopics = await User.countDocuments(find);
  const objectPagination = paginationHelper(initPagination, req.query, countTopics);
  // End Pagination

  const records = await User.find(find).select("-password -token").limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.render("admin/pages/users/index", {
    pageTitle: "Quản lý User",
    records: records,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/users/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const data = await User.findOne({
      _id: id,
      deleted: false
    });
  
    res.render("admin/pages/users/edit", {
      pageTitle: "Chỉnh sửa User",
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    
    const emailExist = await User.findOne({
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
        status: string,
        avatar?: string,
      };

      const dataAcount: dataAcount = {
        fullName: req.body.fullName,
        email: req.body.email,
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

      await User.updateOne({ _id: id }, dataAcount);
      req.flash("success", "Cập nhật thành công!");
      res.redirect(req.get("Referrer") || "/");
    }
  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }
};

// [DELETE] /admin/users/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await User.updateOne(
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

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status: string = req.params.status;
  const id: string = req.params.id;

  await User.updateOne(
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