import { Request, Response } from "express";
import Singer from "../../models/singer.model";

// [GET] /singers/
export const singers = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
    status: "active"
  });

  res.render("client/pages/singers/index.pug", {
    pageTitle: "Ca sĩ",
    singers: singers
  });
};