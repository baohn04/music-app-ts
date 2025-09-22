import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

// [GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
  // SORT
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }
  // END SORT

  const songs = await Song.find({
    deleted: false,
  }).sort(sort);

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    });

    const infoTopic = await Topic.findOne({
      _id: song.topicId,
      deleted: false,
    });

    song["infoSinger"] = infoSinger;
    song["infoTopic"] = infoTopic;
  }

  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs,
  });
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
    status: "active",
  }).select("title");

  const singers = await Singer.find({
    deleted: false,
    status: "active",
  }).select("fullName");

  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers,
  });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  try {
    interface dataSong {
      title: string;
      avatar: string;
      description: string;
      singerId: string;
      topicId: string;
      lyrics?: string;
      audio: string;
      status: string;
      position: number;
    }

    let avatar = "";
    let audio = "";

    if (req.body.avatar) {
      avatar = req.body.avatar[0];
    }

    if (req.body.audio) {
      audio = req.body.audio[0];
    }

    const dataSong: dataSong = {
      title: req.body.title,
      topicId: req.body.topicId,
      singerId: req.body.singerId,
      description: req.body.description,
      status: req.body.status,
      avatar: avatar,
      audio: audio,
      position: (await Song.countDocuments()) + 1,
    };

    if (req.body.lyrics) {
      dataSong["lyrics"] = req.body.lyrics;
    }

    const song = new Song(dataSong);
    await song.save();

    req.flash("success", "Thêm bài hát thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    req.flash("error", "Thêm bài hát thất bại!");
  }
};

// [GET] /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
  });

  const topics = await Topic.find({
    deleted: false,
  }).select("title");

  const singers = await Singer.find({
    deleted: false,
  }).select("fullName");

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chỉnh sửa bài hát",
    song: song,
    topics: topics,
    singers: singers,
  });
};

// [POST] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    interface dataSong {
      title: string;
      avatar?: string;
      description: string;
      singerId: string;
      topicId: string;
      lyrics: string;
      audio?: string;
      status: string;
    }

    const dataSong: dataSong = {
      title: req.body.title,
      topicId: req.body.topicId,
      singerId: req.body.singerId,
      description: req.body.description,
      status: req.body.status,
      lyrics: req.body.lyrics,
    };

    if (req.body.avatar) {
      dataSong["avatar"] = req.body.avatar[0];
    }

    if (req.body.audio) {
      dataSong["audio"] = req.body.audio[0];
    }

    await Song.updateOne(
      {
        _id: id,
      },
      dataSong
    );

    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
};

// [GET] /admin/songs/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const song = await Song.findOne({
      _id: id,
      deleted: false,
    });

    const singer = await Singer.findOne({
      _id: song.singerId,
    }).select("fullName");

    const topic = await Topic.findOne({
      _id: song.topicId,
    }).select("title");

    res.render("admin/pages/songs/detail", {
      pageTitle: song["title"],
      song: song,
      singer: singer,
      topic: topic,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};

// [DELETE] /admin/songs/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Song.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa sản phẩm thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/404-not-found`);
  }
};
