import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../utils/token";

export function authorization(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token === undefined) {
    return res.status(401).json("None authorization in header");
  }

  const payload = verifyAccessToken(token);
  if (payload instanceof Error) {
    return res.status(401).json(payload.message);
  }
  req.body.payload = payload;
  return next();
}
