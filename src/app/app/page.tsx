"use client";

import { useMemo, useState } from "react";

type Tx = {
  id: string;
  type: "Расход" | "Доход";
  title: string;
  amount: number;
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function AppPage() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [items] = useState<Tx[]>([
    { id: "1", type: "Расход", title: "Аренда", amount: 1200 },
    { id: "2", type: "Доход", title: "Продажи", amount: 5400 },
  ]);

  const totals = useMemo(() => {
    const income = items
      .filter((x) => x.type === "Доход")
      .reduce((s, x) => s + x.amount, 0);
    const expense = items
      .filter((x) => x.type === "Расход")
      .reduce((s, x) => s + x.amount, 0);
    return { income, expense, net: income - expense };
  }, [items]);

  const onLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="md:sticky md:top-8 h-fit">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="pb-4">
                <div className="text-[18px] font-semibold tracking-tight text-gray-950">
                  Happy Planet
                </div>
                <div className="mt-2 h-px w-full bg-gray-200/70" />
              </div>

              <nav className="mt-4 space-y-1">
                <button
                  className="w-full rounded-2xl px-3 py-2 text-left text-[14px] text-gray-900 hover:bg-gray-50"
                  type="button"
                >
                  Профиль компании
                </button>
                <button
                  className="w-full rounded-2xl px-3 py-2 text-left text-[14px] text-gray-900 hover:bg-gray-50"
                  type="button"
                >
                  Аналитика
                </button>
              </nav>

              <div className="mt-6">
                <button
                  onClick={onLogout}
                  type="button"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.99]"
                >
                  Выйти
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            {/* Top bar */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Breadcrumb-like */}
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  <span className="text-gray-900">Управленческий учёт</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700">Операции</span>
                </div>

                {/* Month picker */}
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-gray-500">Месяц</span>

                  <div className="relative">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="
                        appearance-none
                        rounded-2xl
                        border border-gray-200
                        bg-white
                        px-4
                        pr-12
                        py-2
                        text-[14px]
                        text-gray-900
                        shadow-sm
                        outline-none
                        transition
                        focus:border-gray-300
                        focus:ring-4
                        focus:ring-gray-100
                      "
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {/* Custom arrow: moved left via right-4 */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-700"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded-2xl bg-gray-900 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-[0.99]"
                >
                  Добавить расход
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.99]"
                >
                  Добавить доход
                </button>

                <div className="sm:ml-auto flex items-center gap-3 text-[13px] text-gray-500">
                  <span>Доход: {totals.income.toLocaleString("ru-RU")} BYN</span>
                  <span className="text-gray-300">•</span>
                  <span>Расход: {totals.expense.toLocaleString("ru-RU")} BYN</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-900">
                    Итог: {totals.net.toLocaleString("ru-RU")} BYN
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4 text-[14px] font-medium text-gray-900">
                Операции за {month}
              </div>
              <div className="h-px bg-gray-200/70" />

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/60">
                    <tr className="text-[12px] font-medium text-gray-500">
                      <th className="px-5 py-3">Тип</th>
                      <th className="px-5 py-3">Статья</th>
                      <th className="px-5 py-3 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((x) => (
                      <tr key={x.id} className="border-t border-gray-100">
                        <td className="px-5 py-4 text-[14px] text-gray-900">
                          {x.type}
                        </td>
                        <td className="px-5 py-4 text-[14px] text-gray-700">
                          {x.title}
                        </td>
                        <td className="px-5 py-4 text-right text-[14px] text-gray-900">
                          {x.amount.toLocaleString("ru-RU")} BYN
                        </td>
                      </tr>
                    ))}

                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-5 py-10 text-center text-[14px] text-gray-500"
                        >
                          Нет данных за выбранный месяц
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
