"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SearchDialog } from "@/components/navigation/search-dialog";
import { LabGlyph } from "@/components/shared/icons";
import { labs } from "@/src/lib/labs";
import { navigation } from "@/src/lib/site";
import { useApp } from "@/src/lib/store/app-provider";
import { cn } from "@/src/lib/utils";

type Panel = "notifications" | "profile" | null;

export function Navbar() {
  const pathname = usePathname();
  const {
    profile,
    hydrated,
    signOut,
    recent,
    cloudEnabled,
  } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [hasUnread, setHasUnread] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setPanel(null);
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setPanel(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const primaryNav = navigation.slice(0, 6);
  const moreNav = navigation.slice(6);

  const initials = useMemo(() => {
    if (!profile) return "NS";
    const source = profile.name.trim() || profile.email;
    return source
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile]);

  const notifications = useMemo(() => {
    const recentItems = recent.slice(0, 3).map((entry) => {
      if (entry.kind === "lab") {
        const lab = labs.find((item) => item.id === entry.refId);
        return {
          title: lab ? `Resumed ${lab.name}` : "Lab activity",
          body: lab?.tagline ?? "Your recent lab activity is saved.",
          href: `/playground?lab=${entry.refId}`,
        };
      }
      return {
        title: "Explored a tool",
        body: entry.refId.replace(/-/g, " "),
        href: "/tools",
      };
    });

    return [
      ...recentItems,
      {
        title: "Seven labs are online",
        body: "Arduino, ESP32, Protocol Explorer and more are ready.",
        href: "/explore",
      },
      {
        title: "Technology showroom open",
        body: "Walk the 3D floor and inspect 16 tools.",
        href: "/showroom",
      },
    ].slice(0, 4);
  }, [recent]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] w-full border-b border-ink/[0.06] bg-white/95 backdrop-blur-xl transition-shadow duration-300",
          scrolled && "shadow-nav",
        )}
      >
        <div className="container-wide flex h-[84px] items-center justify-between gap-4 xl:h-[96px]">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="shrink-0" />
          </div>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-4 xl:flex 2xl:gap-6"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(item.href)}
                className={cn(
                  "link-underline whitespace-nowrap py-2 text-[12.5px] font-medium transition-colors 2xl:text-[13px]",
                  isActive(item.href)
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((value) => !value)}
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap py-2 text-[12.5px] font-medium transition-colors 2xl:text-[13px]",
                  moreOpen || moreNav.some((item) => isActive(item.href))
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink",
                )}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                More <MoreHorizontal className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 top-11 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-card"
                  >
                    {moreNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-spark-yellow/15 text-ink"
                            : "text-ink-muted hover:bg-warm hover:text-ink",
                        )}
                      >
                        {item.label}
                        <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-ink/10 px-2.5 text-ink-muted transition-colors hover:border-ink/20 hover:text-ink lg:px-3.5"
              aria-label="Search Nano Playground (Command K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden text-xs lg:inline">Search</span>
              <span className="ml-1 hidden items-center gap-0.5 rounded border border-ink/10 bg-warm px-1.5 py-0.5 text-[9px] text-ink-muted/80 lg:flex">
                <Command className="h-2.5 w-2.5" />K
              </span>
            </button>

            <div className="relative" ref={panelRef}>
              <button
                onClick={() => {
                  setPanel(panel === "notifications" ? null : "notifications");
                  setHasUnread(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
                aria-label="Notifications"
                aria-expanded={panel === "notifications"}
              >
                <Bell className="h-[18px] w-[18px]" />
                {hasUnread && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-spark-dark ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {panel === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-[min(92vw,340px)] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card"
                  >
                    <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-3.5">
                      <p className="font-display text-sm font-semibold">
                        Notifications
                      </p>
                      <button
                        onClick={() => setHasUnread(false)}
                        className="text-[11px] font-medium text-ink-muted hover:text-ink"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="max-h-[330px] overflow-y-auto">
                      {notifications.map((item, index) => (
                        <Link
                          key={`${item.title}-${index}`}
                          href={item.href}
                          onClick={() => setPanel(null)}
                          className="flex gap-3 border-b border-ink/[0.05] px-4 py-3.5 transition-colors last:border-0 hover:bg-warm/70"
                        >
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-spark-yellow/15 text-spark-dark">
                            <Sparkles className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-[13px] font-semibold">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-muted">
                              {item.body}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setPanel(null)}
                      className="flex items-center justify-between bg-warm/60 px-4 py-3 text-xs font-semibold text-ink transition-colors hover:bg-warm"
                    >
                      Open your dashboard
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {hydrated && profile ? (
              <div className="relative">
                <button
                  onClick={() => setPanel(panel === "profile" ? null : "profile")}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-ink/[0.04]"
                  aria-label="Account menu"
                  aria-expanded={panel === "profile"}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-spark-yellow">
                    {initials}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-ink-muted sm:block" />
                </button>
                <AnimatePresence>
                  {panel === "profile" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-12 w-[min(92vw,270px)] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card"
                    >
                      <div className="border-b border-ink/[0.07] px-4 py-4">
                        <p className="truncate text-sm font-semibold">
                          {profile.name}
                        </p>
                        <p className="truncate text-[11px] text-ink-muted">
                          {profile.email}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-spark-yellow/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-spark-dark">
                          <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
                          {cloudEnabled && profile.provider !== "demo"
                            ? "Cloud account"
                            : "Demo session"}
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setPanel(null)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        href="/playground"
                        onClick={() => setPanel(null)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                      >
                        <Play className="h-4 w-4" /> Playground
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          setPanel(null);
                        }}
                        className="flex w-full items-center gap-2.5 border-t border-ink/[0.07] px-4 py-3 text-left text-sm text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.04] xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {panel && (
          <button
            className="fixed inset-0 z-[-1] cursor-default"
            onClick={() => setPanel(null)}
            aria-label="Close menu"
            tabIndex={-1}
          />
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              className="fixed inset-0 z-[110] bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[120] flex w-[min(88vw,390px)] flex-col bg-white shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-4">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted/70">
                  Explore
                </p>
                <nav className="grid gap-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + index * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-3 font-display text-[17px] font-semibold transition-colors",
                          isActive(item.href)
                            ? "bg-spark-yellow/15 text-ink"
                            : "text-ink-muted hover:bg-warm hover:text-ink",
                        )}
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 opacity-40" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <p className="mb-3 mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted/70">
                  Quick labs
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {labs.slice(0, 4).map((lab) => (
                    <Link
                      key={lab.id}
                      href={`/playground?lab=${lab.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col gap-2 rounded-2xl border border-ink/[0.07] p-3 text-left transition-colors hover:border-spark-dark/40 hover:bg-warm/60"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-spark-yellow">
                        <LabGlyph icon={lab.icon} className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold leading-tight">
                        {lab.name}
                      </span>
                    </Link>
                  ))}
                </div>

              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
