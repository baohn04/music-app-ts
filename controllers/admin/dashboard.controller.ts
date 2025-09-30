import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import AccountAdmin from "../../models/account-admin.model";
import User from "../../models/user.model";

// [GET] /admin/dashboard/
export const index = async (req: Request, res: Response) => {
  const statictis = {
    topic: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    singer: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    song: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    accountAdmin: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    accountUser: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Thống kê topic
  statictis.topic.total = await Topic.countDocuments({
    deleted: false
  });

  statictis.topic.active = await Topic.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.topic.inactive = await Topic.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thống kê singer
  statictis.singer.total = await Singer.countDocuments({
    deleted: false
  });

  statictis.singer.active = await Singer.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.singer.inactive = await Singer.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thống kê song
  statictis.song.total = await Song.countDocuments({
    deleted: false
  });

  statictis.song.active = await Song.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.song.inactive = await Song.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thống kê account admin
  statictis.accountAdmin.total = await AccountAdmin.countDocuments({
    deleted: false
  });

  statictis.accountAdmin.active = await AccountAdmin.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.accountAdmin.inactive = await AccountAdmin.countDocuments({
    status: "inactive",
    deleted: false
  });

  // Thống kê account user
  statictis.accountUser.total = await User.countDocuments({
    deleted: false
  });

  statictis.accountUser.active = await User.countDocuments({
    status: "active",
    deleted: false
  });

  statictis.accountUser.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false
  });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Tổng quan",
    statictis: statictis
  });
}