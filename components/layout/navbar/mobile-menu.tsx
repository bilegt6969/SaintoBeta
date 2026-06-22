"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowUpRightIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

// Mocking a more complex menu structure to match the image's accordion style
type MenuItem = {
  title: string;
  path?: string;
  external?: boolean;
  subItems?: { title: string; path: string }[];
};

const mockMenu: MenuItem[] = [
  {
    title: "PHI",
    subItems: [
      { title: "Antenna", path: "/antenna" },
      { title: "Shop", path: "/shop" },
      { title: "Residences", path: "/residences" },
      { title: "Explore", path: "/explore" },
      { title: "About", path: "/about" },
    ],
  },
  { title: "Centre", path: "/centre", external: true },
  { title: "Fondation", path: "/fondation", external: true },
  {
    title: "Studio",
    subItems: [
      { title: "Careers", path: "/careers" },
      { title: "Media", path: "/media" },
      { title: "Contact", path: "/contact" },
      { title: "Français", path: "/fr" },
    ],
  },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("PHI");

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center text-neutral-900 transition-colors md:hidden dark:text-neutral-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-6 w-6 stroke-[1.5]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          {/* 1. Heavy Dark Blurred Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-2xl"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="opacity-100 backdrop-blur-2xl"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full flex-col p-4">
              {/* 2. Floating Circular Close Button */}
              <Transition.Child
                as={Fragment}
                enter="transition-all duration-500 delay-100 ease-[cubic-bezier(0.32,0.72,0,1)]"
                enterFrom="opacity-0 -translate-x-4 scale-90"
                enterTo="opacity-100 translate-x-0 scale-100"
                leave="transition-all duration-200 ease-in-out"
                leaveFrom="opacity-100 translate-x-0 scale-100"
                leaveTo="opacity-0 -translate-x-4 scale-90"
              >
                <div className="mb-4">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <XMarkIcon className="h-5 w-5 stroke-2" />
                  </button>
                </div>
              </Transition.Child>

              {/* 3. Floating White Rounded Card */}
              <Transition.Child
                as={Fragment}
                enter="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                enterFrom="opacity-0 -translate-x-8 scale-95"
                enterTo="opacity-100 translate-x-0 scale-100"
                leave="transition-all duration-300 ease-in-out"
                leaveFrom="opacity-100 translate-x-0 scale-100"
                leaveTo="opacity-0 -translate-x-8 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[320px] rounded-[32px] bg-white pb-24 shadow-2xl">
                  <ul className="flex flex-col">
                    {mockMenu.map((item, index) => (
                      <li
                        key={item.title}
                        className={`border-neutral-200/60 px-6 py-5 ${
                          index !== 0 ? "border-t" : ""
                        }`}
                      >
                        {item.subItems ? (
                          // Accordion Item
                          <div className="flex flex-col">
                            <button
                              onClick={() => toggleAccordion(item.title)}
                              className="flex w-full items-center justify-between text-left text-2xl font-semibold tracking-tight text-black"
                            >
                              {item.title}
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                                {openAccordion === item.title ? (
                                  <MinusIcon className="h-4 w-4 text-black stroke-2" />
                                ) : (
                                  <PlusIcon className="h-4 w-4 text-black stroke-2" />
                                )}
                              </span>
                            </button>

                            {/* Accordion Content */}
                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                openAccordion === item.title
                                  ? "grid-rows-[1fr] opacity-100 pt-4"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <ul className="flex flex-col gap-3">
                                  {item.subItems.map((sub) => (
                                    <li key={sub.title}>
                                      <Link
                                        href={sub.path}
                                        onClick={closeMobileMenu}
                                        className="text-xl text-neutral-800 transition-colors hover:text-neutral-500"
                                      >
                                        {sub.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Standard or External Link
                          <Link
                            href={item.path || "#"}
                            onClick={closeMobileMenu}
                            className="flex items-center text-2xl font-semibold tracking-tight text-black transition-colors hover:text-neutral-600"
                          >
                            {item.title}
                            {item.external && (
                              <ArrowUpRightIcon className="ml-2 h-5 w-5 stroke-2 text-black" />
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Absolute positioned floating visit site button inside the card */}
                  <div className="absolute bottom-6 left-6">
                    <button className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-5 py-3 text-lg font-medium text-black transition-colors hover:bg-neutral-100">
                      <ArrowUpRightIcon className="h-4 w-4 stroke-2" />
                      Visit site
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
