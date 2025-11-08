import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";
import filterStatusHelper from "../../helpers/filterStatus";
import convertToSlug from "../../helpers/convertToSlug";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/singers/
export const index = async (req: Request, res: Response) => {
  let find = {
    deleted: false,
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

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }
  // End Sort

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 4,
  }

  const countTopics = await Singer.countDocuments(find);
  const objectPagination = paginationHelper(initPagination, req.query, countTopics);
  // End Pagination

  const singers = await Singer.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.render("admin/pages/singers/index", {
    pageTitle: "Quản lý ca sĩ",
    singers: singers,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singers/create", {
    pageTitle: "Thêm mới ca sĩ",
  });
};

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  try {
    interface dataSinger {
      fullName: string;
      nation: string;
      status: string;
      avatar: string;
      position: number;
    }

    const dataSinger: dataSinger = {
      fullName: req.body.fullName,
      nation: req.body.nation,
      status: req.body.status,
      avatar: req.body.avatar,
      position: (await Singer.countDocuments()) + 1,
    };

    const singer = new Singer(dataSinger);
    await singer.save();

    req.flash("success", "Thêm ca sĩ thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    req.flash("error", "Thêm ca sĩ thất bại!");
  }
};

// [GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const singer = await Singer.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/singers/edit", {
      pageTitle: "Chỉnh sửa ca sĩ",
      singer: singer,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    interface dataSinger {
      fullName: string;
      nation: string;
      status: string;
      avatar?: string;
    }

    const dataSinger: dataSinger = {
      fullName: req.body.fullName,
      nation: req.body.nation,
      status: req.body.status,
    };

    if (req.body.avatar) {
      dataSinger["avatar"] = req.body.avatar;
    }

    await Singer.updateOne(
      {
        _id: id,
      },
      dataSinger
    );

    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const singer = await Singer.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/singers/detail", {
      pageTitle: singer["fullName"],
      singer: singer,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [DELETE] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Singer.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa ca sĩ thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/singers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status: string = req.params.status;
  const id: string = req.params.id;

  console.log(status);
  console.log(id);

  await Singer.updateOne(
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