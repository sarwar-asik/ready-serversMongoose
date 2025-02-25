

import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresTime: any
): string => {
  return jwt.sign(payload, secret, { expiresIn: expiresTime });
};


const verifyToken = (token: string, secret: Secret): JwtPayload => {
  //   console.log(token, secret, 'verifiung the token  ');
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
