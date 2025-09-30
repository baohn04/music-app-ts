import { NextFunction, Request, Response } from "express";
import SettingGeneral from "../../models/setting-general.model";

export const settingGeneral = async (req: Request, res: Response, next: NextFunction) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.locals.settingGeneral = settingGeneral;
  next();
};