/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { TokenModel } from "../models/auth";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1w" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenModel;
}
