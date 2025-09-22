import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";
import convertToSlug from "../../helpers/convertToSlug";
import paginationHelper from "../../helpers/pagination";
import filterStatusHelper from "../../helpers/filterStatus";

// [GET] /admin/topics/
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
      { title: keywordRegex }, 
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

  const countTopics = await Topic.countDocuments(find);
  const objectPagination = paginationHelper(initPagination, req.query, countTopics);
  // End Pagination

  const topics = await Topic.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.render("admin/pages/topics/index", {
    pageTitle: "Quản lý chủ đề",
    topics: topics,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/topics/create", {
    pageTitle: "Thêm mới chủ đề",
  });
};

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
  try {
    interface dataTopic {
      title: string;
      description: string;
      status: string;
      avatar: string;
      position: number;
    }

    const dataTopic: dataTopic = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      avatar: req.body.avatar,
      position: (await Topic.countDocuments()) + 1,
    };

    const topic = new Topic(dataTopic);
    await topic.save();

    req.flash("success", "Thêm chủ đề thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
  } catch (error) {
    req.flash("error", "Thêm chủ đề thất bại!");
  }
};

// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const topic = await Topic.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/topics/edit", {
    pageTitle: "Chỉnh sửa chủ đề",
    topic: topic,
  });
};

// [PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    interface dataTopic {
      title: string;
      description: string;
      status: string;
      avatar?: string;
    }

    const dataTopic: dataTopic = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    if (req.body.avatar) {
      dataTopic["avatar"] = req.body.avatar;
    }

    await Topic.updateOne(
      {
        _id: id,
      },
      dataTopic
    );

    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
};

// [GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const topic = await Topic.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/topics/detail", {
      pageTitle: topic["title"],
      topic: topic,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [DELETE] /admin/topics/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Topic.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa chủ đề thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [PATCH] /admin/topics/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const status: string = req.params.status;
  const id: string = req.params.id;

  console.log(status);
  console.log(id);

  await Topic.updateOne(
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
