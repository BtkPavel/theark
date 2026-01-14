import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "OK" }, { status: 200 });
  res.cookies.set("theark_session", "", { path: "/", maxAge: 0 });
  return res;
}
