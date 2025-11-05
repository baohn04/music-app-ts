import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /
export const home = async (req: Request, res: Response) => {
  const topTopics = await Topic.aggregate([
    {
      $lookup: {
        from: "songs",
        localField: "_id",
        foreignField: "topicId",
        as: "songs"
      }
    },
    {
      $addFields: {
        song_count: { $size: "$songs" }
      }
    },
    {
      $sort: {
        song_count: -1
      }
    },
    {
      $limit: 4
    }
  ]);

  const topListenSongs = await Song.find({
    status: "active",
    deleted: false,
  }).sort({ listen: "desc" }).limit(15);

  for (const song of topListenSongs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    });

    song["infoSinger"] = infoSinger;
  }

  const singers = await Singer.find({
    status: "active",
    deleted: false
  });

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    topTopics: topTopics,
    topListenSongs: topListenSongs,
    singers: singers
  });
};