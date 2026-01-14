"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      // на всякий случай: если сервер вернул не-JSON
      const data = await res.json().catch(() => ({ message: "Ошибка ответа сервера" }));

      if (res.ok) {
        setIsError(false);
        setMessage("Вход выполнен");
        window.location.href = "/app";
        // позже: редирект на /app или /dashboard
        // window.location.href = "/app";
      } else {
        setIsError(true);
        setMessage(data?.message ?? "Неверные данные");
      }
    } catch {
      setIsError(true);
      setMessage("Сетевая ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="theark"
            width={500}
            height={500}
            priority
            className="w-80 h-auto"
          />
        </div>

        <div className="-mt-16">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>

          {message ? (
            <div className={`mt-4 text-center text-sm ${isError ? "text-red-600" : "text-emerald-600"}`}>
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
