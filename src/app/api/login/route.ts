import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const login = body?.login ?? "";
    const password = body?.password ?? "";

    const expectedLogin = process.env.APP_LOGIN ?? "";
    const expectedPassword = process.env.APP_PASSWORD ?? "";

    if (!login || !password) {
      return NextResponse.json({ message: "Введите логин и пароль" }, { status: 400 });
    }

    if (login !== expectedLogin || password !== expectedPassword) {
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = await signSession({ login });

    const res = NextResponse.json({ message: "OK" }, { status: 200 });
    res.cookies.set("theark_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
