import { Request, Response } from "express";

// [GET] /home/
export const home = async (req: Request, res: Response) => {
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
  });
};