export interface IJwtPayload {
  jti: string;
  uid: string;
  iat: number;
  exp: number;
}
