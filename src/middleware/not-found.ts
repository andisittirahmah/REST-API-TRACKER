import { Request, Response } from "express";

export default function notFoundMiffleware(req: Request, res: Response) {
  res.status(404).json({ message: "you seem lost" });
}
