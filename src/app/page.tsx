import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_MODULES } from "@/data/modules";
import { LessonCard } from "@/components/ui/LessonCard";

// Feature list carries its own weight through the numbering and the type
// scale; the decorative icon each card used to open with added nothing the
// heading did not already say.
const FEATURES = [
  { title: "AI Тьютор", desc: "Механика бойынша 24/7 жеке көмекші, тек қазақ тілінде жауап береді." },
  { title: "3D симуляциялар", desc: "Әр сабақта PASCO жабдығымен жасалған, физикасы нақты виртуалды зертхана." },
  { title: "Интерактивті ойындар", desc: "Сәйкестендіру, жады, флэш-карточка және басқа да оқу ойындары." },
  { title: "Оқу аналитикасы", desc: "Прогресс, құзыреттілік өсуі және белсенділік графиктер арқылы көрінеді." },
  { title: "Сертификаттар", desc: "QR-код арқылы расталатын электронды сертификаттар." },
  { title: "Құзыреттілік бағалау", desc: "10 критерий бойынша ғылыми негізделген рубрика." },
];

const NUMBERS = [
  { value: "10", label: "оқу сабағы" },
  { value: "10", label: "3D симуляция" },
  { value: "10", label: "бағалау критерийі" },
  { value: "5", label: "оқу ойыны" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">
              М
            </div>
            <span className="text-h3">Механика AI LMS</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary px-4 py-2 text-sm">
              Кіру
            </Link>
            <Link href="/dashboard" className="btn-primary px-4 py-2 text-sm">
              Демо нұсқаны көру
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <span className="badge mb-5">Магистрлік диссертация жобасы</span>
        <h1 className="text-display md:text-[3rem] md:leading-[1.1]">
          Механиканы қашықтықтан оқытуға арналған{" "}
          <span className="text-brand-600 dark:text-brand-400">жасанды интеллект</span> платформасы
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-body text-slate-600 dark:text-slate-400">
          Студенттердің ақпараттық-коммуникативтік құзыреттілігін қалыптастыруға арналған,
          10 сабақтан тұратын, AI тьютор, 3D зертхана және құзыреттілікке негізделген бағалау
          жүйесі бар оқыту ортасы.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Студент ретінде бастау <ArrowRight size={18} />
          </Link>
          <Link href="/teacher" className="btn-secondary">
            Оқытушы дашбордын көру
          </Link>
        </div>
      </section>

      {/* The numbers are the illustration. */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <dl className="surface grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 dark:divide-white/5">
          {NUMBERS.map((n) => (
            <div key={n.label} className="px-5 py-6 text-center">
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <span className="data-num block text-display text-brand-600 dark:text-brand-400">
                  {n.value}
                </span>
                <span className="mt-1 block text-micro uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {n.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="surface p-5">
              <span className="data-num text-label text-slate-500 dark:text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-h3">{f.title}</h3>
              <p className="mt-1.5 text-body text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-5 text-center text-h2">10 оқу сабағы</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ALL_MODULES.map((m) => (
            <LessonCard key={m.id} id={m.id} title={m.title} compact />
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-micro text-slate-500 dark:border-white/10 dark:text-slate-400">
        © {new Date().getFullYear()} Механика AI LMS — Ахмет Ясауи атындағы университет.
        Магистрлік зерттеу жобасы.
      </footer>
    </div>
  );
}
