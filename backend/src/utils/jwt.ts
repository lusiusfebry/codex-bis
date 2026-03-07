import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  nik: string;
  role: string;
}

export function signJwt(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

  if (!secret) {
    throw new Error("JWT_SECRET belum dikonfigurasi.");
  }

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET belum dikonfigurasi.");
  }

  return jwt.verify(token, secret) as JwtPayload;
}
