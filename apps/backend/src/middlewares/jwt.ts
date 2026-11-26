import * as jwt from 'jsonwebtoken';

const generateAccessToken = (uid: string, role: string, email: string, sessionId: string) =>
  jwt.sign({ uid, roles: [role], email, sid: sessionId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRE || "15m") as jwt.SignOptions["expiresIn"],
  });
const generateRefreshToken = (uid: string, role: string, email: string, sessionId: string) =>
  jwt.sign({ uid, email, roles: [role], sid: sessionId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE || "7d") as jwt.SignOptions["expiresIn"],
  });

const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);

export { generateAccessToken, generateRefreshToken, verifyToken };
