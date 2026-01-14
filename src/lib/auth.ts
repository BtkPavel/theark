import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.APP_SESSION_SECRET ?? "");

export async function signSession(payload: { login: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { login: string; iat: number; exp: number };
}
