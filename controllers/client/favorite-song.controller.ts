import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
  const favoriteSongs = await FavoriteSong.find({
    userId: req["user"].id,
    deleted: false
  });

  // Lấy danh sách songId từ các bản ghi yêu thích
  const songIds = favoriteSongs.map(item => item.songId)

  // Query tất cả bài hát
  const songs = await Song.find({ _id: { $in: songIds } });
  const songIdToSong: { [key: string]: any } = {};
  for (const s of songs) {
    songIdToSong[String(s._id)] = s;
  }

  // Lấy danh sách singerId duy nhất từ các bài hát
  const singerIds = Array.from(new Set(songs.map(s => String(s.singerId))));

  // Query tất cả ca sĩ
  const singers = await Singer.find({ _id: { $in: singerIds } });
  const singerIdToSinger: { [key: string]: any } = {};
  for (const sg of singers) {
    singerIdToSinger[String(sg._id)] = sg;
  }

  // Gán infoSong, infoSinger lên từng item (giữ nguyên để hiển thị)
  for (const item of favoriteSongs) {
    const infoSong = songIdToSong[String(item.songId)];
    if (!infoSong) continue;
    const infoSinger = singerIdToSinger[String(infoSong.singerId)];
    item["infoSong"] = infoSong;
    item["infoSinger"] = infoSinger;
  }

  // Mảng bài hát theo đúng thứ tự favorites (phục vụ audio-player)
  const infoSongs = favoriteSongs.map(item => songIdToSong[String(item.songId)])

  // Mảng ca sĩ (duy nhất) phục vụ audio-player
  const singersArr = Object.values(singerIdToSinger);

  res.render("client/pages/favorite-songs/index.pug", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: favoriteSongs,
    infoSongs: infoSongs,
    singersOfFavoriteSongs: singersArr
  });
};