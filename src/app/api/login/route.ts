import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const login = body?.login ?? "";
    const password = body?.password ?? "";

    const expectedLogin = process.env.APP_LOGIN ?? "";
    const expectedPassword = process.env.APP_PASSWORD ?? "";

    // Проверка на пустые логин и пароль
    if (!login || !password) {
      return NextResponse.json({ message: "Введите логин и пароль" }, { status: 400 });
    }

    // Проверка на правильность логина и пароля
    if (login !== expectedLogin || password !== expectedPassword) {
      console.error('Incorrect login or password');
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 });
    }

    // Если логин и пароль правильные, создаём токен сессии
    const token = await signSession({ login });

    // Отправляем успешный ответ и сохраняем токен в cookies
    const res = NextResponse.json({ message: "OK" }, { status: 200 });
    res.cookies.set("theark_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return res;
  } catch (err) {
    console.error('Error during login process:', err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
