import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const listByTopic = async (req: Request, res: Response) => {
  try {
    const slugTopic = req.params.slugTopic;

    const topic = await Topic.findOne({
      slug: slugTopic,
      status: "active",
      deleted: false,
    });

    const topics = await Topic.find({
      _id: { $ne: topic._id },
      status: "active",
      deleted: false
    })

    const songs = await Song.find({
      topicId: topic.id,
      status: "active",
      deleted: false,
    }).select("avatar title slug singerId like listen audio");

    // Lấy danh sách singerId duy nhất từ songs của topic này
    const singerIds = songs.map(song => song.singerId);
    // Xử lý singerIds trùng lặp: set()
    const uniqueSingerIds = Array.from(new Set(singerIds.map(id => id.toString())));

    const singersOfTopic = await Singer.find({
      _id: { $in: uniqueSingerIds },
      status: "active",
      deleted: false
    });

    for (const song of songs) {
      const infoSinger = await Singer.findOne({
        _id: song.singerId,
        status: "active",
        deleted: false,
      });

      song["infoSinger"] = infoSinger;
    }

    res.render("client/pages/songs/listByTopic.pug", {
      pageTitle: topic.title,
      topic: topic,
      topics: topics,
      songs: songs,
      singersOfTopic: singersOfTopic,
    });
  } catch (error) {
    res.send("Page 404");
  }
};

// [GET] /songs/singer/:slugSinger
export const listBySinger = async (req: Request, res: Response) => {
  try {
    const slugSinger = req.params.slugSinger;

    const singer = await Singer.findOne({
      slug: slugSinger,
      status: "active",
      deleted: false,
    });

    const similarNationSingers = await Singer.find({
      _id: { $ne: singer._id },
      nation: singer.nation,
      status: "active",
      deleted: false
    });

    const songs = await Song.find({
      singerId: singer.id,
      status: "active",
      deleted: false,
    }).select("avatar title slug singerId like listen audio");

    for (const song of songs) {
      const infoSinger = await Singer.findOne({
        _id: song.singerId,
        status: "active",
        deleted: false,
      });

      song["infoSinger"] = infoSinger;
    }

    res.render("client/pages/songs/listBySinger.pug", {
      pageTitle: singer.fullName,
      singer: singer,
      similarNationSingers: similarNationSingers,
      songs: songs,
    });
  } catch (error) {
    res.send("Page 404");
  }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  try {
    const slugSong: String = req.params.slugSong;

    const song = await Song.findOne({
      slug: slugSong,
      status: "active",
      deleted: false,
    });

    const singer = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    }).select("fullName");

    const topic = await Topic.findOne({
      _id: song.topicId,
      deleted: false,
    }).select("title");

    if (req["user"]) {
      const favoriteSong = await FavoriteSong.findOne({
        userId: req["user"].id,
        songId: song.id,
      });

      song["isFavoriteSong"] = favoriteSong ? true : false;
    }

    res.render("client/pages/songs/detail.pug", {
      pageTitle: song.title,
      song: song,
      singer: singer,
      topic: topic,
    });
  } catch (error) {
    res.send("Page 404");
  }
};

// [PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;

    const song = await Song.findOne({
      _id: idSong,
      status: "active",
      deleted: false,
    });

    const newLike: number = typeLike == "like" ? song.like + 1 : song.like - 1;

    await Song.updateOne(
      {
        _id: idSong,
      },
      {
        like: newLike,
      }
    );

    res.json({
      code: 200,
      message: "Thành công!",
      like: newLike,
    });
  } catch (error) {
    res.send("Page 404");
  }
};

// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite":
        const existFavoriteSong = await FavoriteSong.findOne({
          userId: req["user"].id,
          songId: idSong,
        });
        if (!existFavoriteSong) {
          const record = new FavoriteSong({
            userId: req["user"].id,
            songId: idSong,
          });
          await record.save();
        }
        break;
      case "unfavorite":
        await FavoriteSong.deleteOne({
          userId: req["user"].id,
          songId: idSong,
        });
        break;
      default:
        break;
    }

    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    res.send("Page 404");
  }
};

// [PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;

    const song = await Song.findOne({
      _id: idSong,
      status: "active",
      deleted: false,
    });

    const newListen: number = song.listen + 1;

    await Song.updateOne(
      {
        _id: idSong,
      },
      {
        listen: newListen,
      }
    );

    // Lấy lại thông tin bài hát sau khi update lượt nghe
    const newSong = await Song.findOne({
      _id: idSong,
    });

    res.json({
      code: 200,
      message: "Thành công!",
      listen: newSong.listen,
    });
  } catch (error) {
    res.send("Page 404");
  }
};
