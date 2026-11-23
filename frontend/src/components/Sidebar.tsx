"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthStatus from '@/components/AuthStatus';

const upcomingMenus = [
  "Progress",
  "Review",
  "Vocabulary",
  "Favorites",
  "Streak",
];

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <aside className="flex w-full flex-col bg-violet-600 px-4 py-3 text-white md:h-full md:w-56 md:shrink-0 md:overflow-y-auto md:bg-[#07164C] md:bg-[url('/images/background.png')] md:bg-cover md:bg-bottom md:bg-no-repeat md:px-5 md:py-6">
      {/* ロゴとスマホ用メニューボタン */}
      <div className="flex items-center justify-between gap-4 md:justify-center">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Image
            src="/images/logo-no-title.png"
            alt="Elephant ホーム"
            width={80}
            height={80}
            className="h-10 w-10 rounded-full md:h-20 md:w-20"
          />

          <span className="text-lg font-bold tracking-tight md:hidden">
            Elephant
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="sidebar-navigation"
          className="rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
        >
          {isMenuOpen ? "閉じる ✕" : "メニュー ☰"}
        </button>
      </div>

      {/* スマホでは開閉、PCでは常に表示 */}
      <nav
        id="sidebar-navigation"
        aria-label="メインメニュー"
        className={`mt-4 flex-col gap-2 border-t border-white/15 pt-4 md:mt-8 md:flex md:border-0 md:pt-0 ${
          isMenuOpen ? "flex" : "hidden"
        }`}
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-h-12 w-full items-center justify-center rounded-xl px-3 text-center text-base font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Home
        </Link>

        <Link
          href="/courses"
          onClick={closeMenu}
          className="flex min-h-12 w-full items-center justify-center rounded-xl px-3 text-center text-base font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Courses
        </Link>

        {upcomingMenus.map((menu) => (
          <span
            key={menu}
            className="flex min-h-12 w-full items-center justify-center rounded-xl px-3 text-center text-base font-medium text-white/70"
          >
            {menu}
          </span>
        ))}

        <span className="flex min-h-12 w-full items-center justify-center rounded-xl px-3 text-center text-base font-medium text-white/70">
          Settings
        </span>
        <div className="mt-4 border-t border-white/20 pt-4">
          <AuthStatus />
        </div>
      </nav>
    </aside>
  );
}
