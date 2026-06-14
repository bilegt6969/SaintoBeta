"use client";

import { MorphingModal } from "@/components/motion/morphing-modal";
import type { NavLink } from "lib/navigation";
import { ChevronRight, Grid3x3, Home, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInButton } from "./sign-in-button";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: NavLink[];
}

type View = "main" | "categories" | null;

export default function MobileMenu({ isOpen, setIsOpen, categories }: Props) {
  const [view, setView] = useState<View>(null);

  const handleClose = () => {
    setView(null);
    setIsOpen(false);
  };

  // Sync view state with isOpen prop safely using useEffect
  useEffect(() => {
    if (isOpen && view === null) {
      setView("main");
    } else if (!isOpen && view !== null) {
      setView(null);
    }
  }, [isOpen, view]);

  return (
    <MorphingModal
      viewId={view}
      onClose={handleClose}
      placement="bottom"
      className="max-w-md"
    >
      {view === "main" ? (
        <MainMenu
          onCategories={() => setView("categories")}
          onClose={handleClose}
        />
      ) : view === "categories" ? (
        <CategoriesView
          categories={categories}
          onBack={() => setView("main")}
          onClose={handleClose}
        />
      ) : null}
    </MorphingModal>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all hover:bg-neutral-200 hover:text-neutral-900 active:scale-95"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  onClick,
  href,
  rightIcon,
}: {
  icon: typeof Home;
  label: string;
  onClick?: () => void;
  href?: string;
  rightIcon?: React.ReactNode;
}) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-base font-medium text-neutral-800">{label}</span>
      </div>
      {rightIcon}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-all hover:bg-neutral-50 active:scale-[0.98]"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-all hover:bg-neutral-50 active:scale-[0.98]"
    >
      {content}
    </button>
  );
}

function MainMenu({
  onCategories,
  onClose,
}: {
  onCategories: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <Header title="Menu" onClose={onClose} />
      <nav className="flex flex-col gap-2">
        <Row icon={Home} label="Home" href="/" />
        <Row icon={Search} label="Search" href="/search" />
        <Row
          icon={Grid3x3}
          label="Categories"
          onClick={onCategories}
          rightIcon={<ChevronRight className="h-5 w-5 text-neutral-400" />}
        />
      </nav>
      <div className="mt-8">
        <SignInButton
          className="w-full justify-center rounded-full bg-neutral-900 py-3.5 text-white shadow-lg transition-all hover:bg-neutral-800 active:scale-[0.98]"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

function CategoriesView({
  categories,
  onBack,
  onClose,
}: {
  categories: NavLink[];
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all hover:bg-neutral-200 hover:text-neutral-900 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all hover:bg-neutral-200 hover:text-neutral-900 active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Categories
      </h2>
      <p className="mt-2 text-sm text-neutral-500">
        Browse our collection by category
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {categories.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:border-neutral-300 hover:bg-white active:scale-[0.98]"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-600 shadow-sm transition-all group-hover:bg-neutral-100">
              <Grid3x3 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
