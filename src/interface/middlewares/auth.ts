import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Investor } from "../../domain/investor/investor";

export interface CustomRequest extends Request {
  user?: Investor | any;
}

const authenticateInvestor = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.accesstoken as string;

  const secretKey: string | undefined = process.env.JWT_SECRET_KEY;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey as string, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    if (user) {
      req.user = user;
    }
    next();
  });
};

export default authenticateInvestor;

export const createToken = (user: Investor): string => {
  const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined");
  }
  const token = jwt.sign({ user }, secretKey as string);
  return token;
};
