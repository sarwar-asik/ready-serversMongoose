import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export interface JwtPayloadExtended extends JwtPayload {
  [key: string]: any;
}

export class JwtHelper {
  public static generateToken(
    payload: Record<string, unknown>,
    secret: Secret,
    expiresTime: any,
  ): string {
    return jwt.sign(payload, secret, { expiresIn: expiresTime });
  }

  public static verifyToken(token: string, secret: Secret): JwtPayloadExtended {
    return jwt.verify(token, secret) as JwtPayloadExtended;
  }

  public static decodeToken(
    token: string,
  ): null | { [key: string]: any } | string {
    return jwt.decode(token);
  }
}
