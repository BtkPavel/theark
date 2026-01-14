"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
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

        {/* Form */}
        <div className="-mt-16">
          <form className="space-y-4">
            <div>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                placeholder="Введите логин"
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
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-[0.99]"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
