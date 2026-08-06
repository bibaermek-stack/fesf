import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-6xl font-black text-brand-500">404</p>
      <h1 className="text-xl font-bold">Бет табылмады</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Сұралған бет жүйеде жоқ немесе жойылған.</p>
      <Link href="/" className="btn-primary mt-2">Басты бетке оралу</Link>
    </div>
  );
}
