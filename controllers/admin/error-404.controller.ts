import { Request, Response } from "express";

// [GET] /admin/404-not-found
export const index = async (req: Request, res: Response) => {

  res.render("admin/pages/error/404", {
    pageTitle: "404 Not Found",
  });
}