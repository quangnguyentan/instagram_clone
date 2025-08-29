import * as jwt from 'jsonwebtoken';

const generateAccessToken = (uid: string, role: string) =>
  jwt.sign({ uid, roles: [role] }, process.env.JWT_SECRET!, {
    expiresIn: '2d',
  });
const generateRefreshToken = (uid: string) =>
  jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn: '7d' });

const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);

export { generateAccessToken, generateRefreshToken, verifyToken };
