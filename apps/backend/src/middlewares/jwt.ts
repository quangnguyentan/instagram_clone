import * as jwt from 'jsonwebtoken';

const generateAccessToken = (uid: string, role: string, email: string) =>
  jwt.sign({ uid, roles: [role], email }, process.env.JWT_SECRET!, {
    expiresIn: '2d',
  });
const generateRefreshToken = (uid: string, email: string) =>
  jwt.sign({ uid, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });

const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);

export { generateAccessToken, generateRefreshToken, verifyToken };
