"use client";

import { useEffect, useMemo, useState, type SelectHTMLAttributes } from "react";

type TxType = "Расход" | "Доход";

type ExpenseCategory =
  | "Операционные расходы"
  | "Маркетинг и реклама"
  | "Разработка и производство"
  | "Налоги"
  | "Финансовые расходы"
  | "Административные расходы"
  | "Капитальные затраты"
  | "Инвестиционные расходы"
  | "Прочие расходы";

type IncomeCategory =
  | "Доход по основной деятельности"
  | "Инвестиционных доход"
  | "Доход от аренды"
  | "Проценты по депозитам"
  | "Доход (штрафы и компенсации)"
  | "Одноразовый доход от продажи активов или оборудования"
  | "Доход от проектных услуг";

type Tx = {
  id: string;
  type: TxType;
  dateISO: string; // YYYY-MM-DD
  monthIndex: number; // 0..11

  // Расходы
  category?: ExpenseCategory;
  subcategory?: string;

  // Доходы
  incomeCategory?: IncomeCategory;

  comment?: string;
  title: string; // что показываем в таблице
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

const CATEGORY_MAP: Record<ExpenseCategory, string[]> = {
  "Операционные расходы": [
    "Зарплаты и компенсации",
    "Аренда, коммунальные услуги",
    "Расходы на транспорт",
    "Канцелярия и офисные материалы",
    "Расходы на IT",
  ],
  "Маркетинг и реклама": ["Реклама", "Мероприятия"],
  "Разработка и производство": [
    "Производственные расходы (закупка материалов/инструментов)",
  ],
  Налоги: ["Налог на прибыль", "НДС", "Страховые и пенсионные взносы"],
  "Финансовые расходы": [
    "Проценты по кредитам",
    "Оплата основного долга (кредит)",
    "Перевод на другой счет",
    "Расходы на валютные операции",
  ],
  "Административные расходы": ["Премии", "Мат. помощь"],
  "Капитальные затраты": [
    "Покупка оборудования и недвижимости",
    "Строительство и модернизация",
    "Амортизация основных средств",
  ],
  "Инвестиционные расходы": ["Депозит", "Покупка акций/облигаций"],
  "Прочие расходы": [
    "Пожертвования и благотворительность",
    "Компенсации и возвраты",
    "Прочие нестандартные расходы",
  ],
};

const INCOME_CATEGORIES: IncomeCategory[] = [
  "Доход по основной деятельности",
  "Инвестиционных доход",
  "Доход от аренды",
  "Проценты по депозитам",
  "Доход (штрафы и компенсации)",
  "Одноразовый доход от продажи активов или оборудования",
  "Доход от проектных услуг",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseDDMMYYYYToISO(
  input: string
): { ok: true; iso: string } | { ok: false; error: string } {
  const raw = (input || "").trim();
  if (!raw) return { ok: false, error: "Введите дату" };

  const m = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return { ok: false, error: "Дата должна быть в формате DD.MM.YYYY" };

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);

  if (mm < 1 || mm > 12) return { ok: false, error: "Некорректный месяц" };

  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (
    d.getUTCFullYear() !== yyyy ||
    d.getUTCMonth() !== mm - 1 ||
    d.getUTCDate() !== dd
  ) {
    return { ok: false, error: "Некорректная дата" };
  }

  return { ok: true, iso: `${yyyy}-${pad2(mm)}-${pad2(dd)}` };
}

function monthIndexFromISO(iso: string) {
  const m = Number(iso.slice(5, 7));
  return Number.isFinite(m) ? Math.max(0, Math.min(11, m - 1)) : 0;
}

function formatBYN(n: number) {
  const val = Number.isFinite(n) ? n : 0;
  return `${val.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} BYN`;
}

function SelectWithArrow(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "appearance-none rounded-2xl border border-gray-200 bg-white px-4 pr-12 py-2 text-[14px] text-gray-900 shadow-sm outline-none transition",
          "focus:border-gray-300 focus:ring-4 focus:ring-gray-100",
          props.className ?? "",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center">
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
  );
}

export default function AppPage() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const selectedMonthIndex = useMemo(
    () => Math.max(0, MONTHS.indexOf(month)),
    [month]
  );

  const [items, setItems] = useState<Tx[]>([
    {
      id: "1",
      type: "Расход",
      dateISO: "2026-01-01",
      monthIndex: 0,
      category: "Операционные расходы",
      subcategory: "Аренда, коммунальные услуги",
      comment: "Офис",
      title: "Аренда, коммунальные услуги — Офис",
      amount: 1200,
    },
    {
      id: "2",
      type: "Доход",
      dateISO: "2026-01-05",
      monthIndex: 0,
      incomeCategory: "Доход по основной деятельности",
      comment: "Продажи",
      title: "Доход по основной деятельности — Продажи",
      amount: 5400,
    },
  ]);

  const itemsForMonth = useMemo(
    () => items.filter((x) => x.monthIndex === selectedMonthIndex),
    [items, selectedMonthIndex]
  );

  const totals = useMemo(() => {
    const income = itemsForMonth
      .filter((x) => x.type === "Доход")
      .reduce((s, x) => s + x.amount, 0);
    const expense = itemsForMonth
      .filter((x) => x.type === "Расход")
      .reduce((s, x) => s + x.amount, 0);
    return { income, expense, net: income - expense };
  }, [itemsForMonth]);

  // ---------- Modal state (Расход) ----------
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [dateText, setDateText] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Операционные расходы");
  const [subcategory, setSubcategory] = useState(
    CATEGORY_MAP["Операционные расходы"][0]
  );
  const [comment, setComment] = useState("");
  const [amountText, setAmountText] = useState("");
  const [formError, setFormError] = useState("");

  // при смене категории — автоматически выставляем первую подкатегорию
  useEffect(() => {
    const first = CATEGORY_MAP[category]?.[0] ?? "";
    setSubcategory(first);
  }, [category]);

  const openExpenseModal = () => {
    setFormError("");
    setIsExpenseModalOpen(true);

    const now = new Date();
    const dd = pad2(now.getDate());
    const mm = pad2(now.getMonth() + 1);
    const yyyy = now.getFullYear();

    setDateText(`${dd}.${mm}.${yyyy}`);
    setCategory("Операционные расходы");
    setSubcategory(CATEGORY_MAP["Операционные расходы"][0]);
    setComment("");
    setAmountText("");
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setFormError("");
  };

  const createExpense = () => {
    setFormError("");

    const parsed = parseDDMMYYYYToISO(dateText);
    if (!parsed.ok) {
      setFormError(parsed.error);
      return;
    }

    const amt = Number(String(amountText).replace(",", "."));
    if (!Number.isFinite(amt) || amt <= 0) {
      setFormError("Введите корректную сумму");
      return;
    }

    const cat = category;
    const sub = subcategory;

    if (!cat) {
      setFormError("Выберите категорию");
      return;
    }
    if (!sub) {
      setFormError("Выберите подкатегорию");
      return;
    }

    const trimmedComment = comment.trim();
    const title = trimmedComment ? `${sub} — ${trimmedComment}` : sub;

    const monthIdx = monthIndexFromISO(parsed.iso);

    const newItem: Tx = {
      id: String(Date.now()),
      type: "Расход",
      dateISO: parsed.iso,
      monthIndex: monthIdx,
      category: cat,
      subcategory: sub,
      comment: trimmedComment,
      title,
      amount: Math.round(amt * 100) / 100,
    };

    setItems((prev) => [...prev, newItem]);
    closeExpenseModal();
  };

  // ---------- Modal state (Доход) ----------
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeDateText, setIncomeDateText] = useState("");
  const [incomeAmountText, setIncomeAmountText] = useState("");
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>(
    INCOME_CATEGORIES[0]
  );
  const [incomeComment, setIncomeComment] = useState("");
  const [incomeFormError, setIncomeFormError] = useState("");

  const openIncomeModal = () => {
    setIncomeFormError("");
    setIsIncomeModalOpen(true);

    const now = new Date();
    const dd = pad2(now.getDate());
    const mm = pad2(now.getMonth() + 1);
    const yyyy = now.getFullYear();

    setIncomeDateText(`${dd}.${mm}.${yyyy}`);
    setIncomeAmountText("");
    setIncomeCategory(INCOME_CATEGORIES[0]);
    setIncomeComment("");
  };

  const closeIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setIncomeFormError("");
  };

  const createIncome = () => {
    setIncomeFormError("");

    const parsed = parseDDMMYYYYToISO(incomeDateText);
    if (!parsed.ok) {
      setIncomeFormError(parsed.error);
      return;
    }

    const amt = Number(String(incomeAmountText).replace(",", "."));
    if (!Number.isFinite(amt) || amt <= 0) {
      setIncomeFormError("Введите корректную сумму");
      return;
    }

    const cat = incomeCategory;
    if (!cat) {
      setIncomeFormError("Выберите категорию доходов");
      return;
    }

    const trimmedComment = incomeComment.trim();
    const title = trimmedComment ? `${cat} — ${trimmedComment}` : cat;

    const monthIdx = monthIndexFromISO(parsed.iso);

    const newItem: Tx = {
      id: String(Date.now()),
      type: "Доход",
      dateISO: parsed.iso,
      monthIndex: monthIdx,
      incomeCategory: cat,
      comment: trimmedComment,
      title,
      amount: Math.round(amt * 100) / 100,
    };

    setItems((prev) => [...prev, newItem]);
    closeIncomeModal();
  };

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
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  <span className="text-gray-900">Управленческий учёт</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700">Операции</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-gray-500">Месяц</span>
                  <SelectWithArrow
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </SelectWithArrow>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openExpenseModal}
                  className="rounded-2xl bg-gray-900 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-[0.99]"
                >
                  Добавить расход
                </button>

                <button
                  type="button"
                  onClick={openIncomeModal}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.99]"
                >
                  Добавить доход
                </button>

                <div className="sm:ml-auto flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
                  <span>Доход: {formatBYN(totals.income)}</span>
                  <span className="text-gray-300">•</span>
                  <span>Расход: {formatBYN(totals.expense)}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-900">Итог: {formatBYN(totals.net)}</span>
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
                    {itemsForMonth.map((x) => (
                      <tr key={x.id} className="border-t border-gray-100">
                        <td className="px-5 py-4 text-[14px] text-gray-900">
                          {x.type}
                        </td>
                        <td className="px-5 py-4 text-[14px] text-gray-700">
                          {x.title}
                        </td>
                        <td className="px-5 py-4 text-right text-[14px] text-gray-900">
                          {formatBYN(x.amount)}
                        </td>
                      </tr>
                    ))}

                    {itemsForMonth.length === 0 ? (
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

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeExpenseModal();
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-start justify-between px-6 py-6">
              <div>
                <div className="text-[22px] font-semibold tracking-tight text-gray-950">
                  Добавить расход
                </div>
                <div className="mt-2 text-[14px] text-gray-500">
                  Минималистичная форма ввода
                </div>
              </div>

              <button
                type="button"
                onClick={closeExpenseModal}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                Закрыть
              </button>
            </div>

            <div className="h-px bg-gray-200/70" />

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Дата
                  </label>
                  <input
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Сумма (BYN)
                  </label>
                  <input
                    value={amountText}
                    onChange={(e) => setAmountText(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-1">
                  <label className="block text-[13px] font-medium text-gray-700">
                    Категория затрат
                  </label>
                  <div className="mt-2">
                    <SelectWithArrow
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full py-3"
                    >
                      {(Object.keys(CATEGORY_MAP) as ExpenseCategory[]).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectWithArrow>
                  </div>
                </div>

                {/* Subcategory */}
                <div className="md:col-span-1">
                  <label className="block text-[13px] font-medium text-gray-700">
                    Подкатегория
                  </label>
                  <div className="mt-2">
                    <SelectWithArrow
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full py-3"
                    >
                      {CATEGORY_MAP[category].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </SelectWithArrow>
                  </div>
                </div>

                {/* Comment */}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-gray-700">
                    Комментарий
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Добавьте пояснение к затрате"
                    rows={3}
                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>
              </div>

              {formError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                  {formError}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={createExpense}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-[14px] font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 active:scale-[0.99]"
                >
                  Создать
                </button>
                <button
                  type="button"
                  onClick={closeExpenseModal}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.99]"
                >
                  Отменить
                </button>
              </div>

              <div className="mt-4 text-center text-[12px] text-gray-500">
                Затрата будет добавлена в месяц, соответствующий выбранной дате.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income Modal */}
      {isIncomeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeIncomeModal();
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-start justify-between px-6 py-6">
              <div>
                <div className="text-[22px] font-semibold tracking-tight text-gray-950">
                  Добавить доход
                </div>
                <div className="mt-2 text-[14px] text-gray-500">
                  Минималистичная форма ввода
                </div>
              </div>

              <button
                type="button"
                onClick={closeIncomeModal}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                Закрыть
              </button>
            </div>

            <div className="h-px bg-gray-200/70" />

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Дата
                  </label>
                  <input
                    value={incomeDateText}
                    onChange={(e) => setIncomeDateText(e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Сумма (BYN)
                  </label>
                  <input
                    value={incomeAmountText}
                    onChange={(e) => setIncomeAmountText(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>

                {/* Income category */}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-gray-700">
                    Категория доходов
                  </label>
                  <div className="mt-2">
                    <SelectWithArrow
                      value={incomeCategory}
                      onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                      className="w-full py-3"
                    >
                      {INCOME_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectWithArrow>
                  </div>
                </div>

                {/* Comment */}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-gray-700">
                    Комментарий
                  </label>
                  <textarea
                    value={incomeComment}
                    onChange={(e) => setIncomeComment(e.target.value)}
                    placeholder="Добавьте пояснение к доходу"
                    rows={3}
                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                  />
                </div>
              </div>

              {incomeFormError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                  {incomeFormError}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={createIncome}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-[14px] font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 active:scale-[0.99]"
                >
                  Создать
                </button>
                <button
                  type="button"
                  onClick={closeIncomeModal}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.99]"
                >
                  Отменить
                </button>
              </div>

              <div className="mt-4 text-center text-[12px] text-gray-500">
                Доход будет добавлен в месяц, соответствующий выбранной дате.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
