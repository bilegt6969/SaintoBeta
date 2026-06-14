"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({
  cartButtonVariant = "default",
}: {
  cartButtonVariant?: "default" | "island";
}) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => {
    setIsOpen(false);
    setIsClosing(true);
    setTimeout(() => setIsClosing(false), 150);
  };

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={openCart}
        className={clsx(
          "transition-transform active:scale-95",
          cartButtonVariant === "island" ? "text-[#1d1d1f]" : undefined,
        )}
      >
        <OpenCart quantity={cart?.totalQuantity} variant={cartButtonVariant} />
      </button>
      <Transition show={isOpen}>
        <Dialog
          onClose={closeCart}
          className="relative z-[150] font-sans selection:bg-black selection:text-white"
        >
          {/* Smooth Backdrop Overlay with Permanent Blur Utility */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/15 backdrop-blur-sm dark:bg-black/40"
              aria-hidden="true"
            />
          </Transition.Child>

          {/* Sidebar Drawer */}
          <Transition.Child
            as={Fragment}
            enter="will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] duration-[400ms]"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] duration-[350ms]"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className={`fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-gray-100 bg-white/95 p-8 text-[#1d1d1f] backdrop-blur-xl md:w-[420px] shadow-[0_0_50px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-black/95 dark:text-white ${isOpen ? "backdrop-blur-2xl" : ""}`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-neutral-800">
                <div>
                  <Dialog.Title className="text-xl font-semibold tracking-tight">
                    My Cart
                  </Dialog.Title>
                  {cart && cart.totalQuantity > 0 && (
                    <p className="text-xs text-[#86868b] mt-0.5">
                      {cart.totalQuantity}{" "}
                      {cart.totalQuantity === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <CloseCart />
                </button>
              </div>

              {/* Drawer Workspace */}
              {!cart || cart.lines.length === 0 ? (
                <div className="mt-32 flex w-full flex-col items-center justify-center overflow-hidden px-4">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 dark:bg-neutral-900">
                    <ShoppingCartIcon className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-base font-medium tracking-tight text-[#1d1d1f] dark:text-neutral-200">
                    Your cart is completely empty.
                  </p>
                  <p className="text-xs text-[#86868b] mt-1 text-center max-w-[240px]">
                    Add items to your bag to configure options and finalize
                    shipping.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  {/* Line Items List */}
                  <ul className="grow overflow-auto py-2 pr-1 divide-y divide-gray-100 dark:divide-neutral-950">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col py-5 transition-opacity"
                          >
                            <div className="relative flex w-full flex-row justify-between gap-4">
                              <div className="absolute top-0 left-0 z-40 -ml-2 -mt-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>

                              <div className="flex flex-row gap-4 flex-1">
                                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 flex-shrink-0">
                                  <Image
                                    className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal"
                                    width={80}
                                    height={80}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>

                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="flex flex-col justify-start pt-0.5 flex-1 group"
                                >
                                  <span className="text-sm font-medium leading-tight text-[#1d1d1f] group-hover:text-black transition-colors dark:text-neutral-100">
                                    {item.merchandise.product.title}
                                  </span>
                                  {item.merchandise.title !==
                                    DEFAULT_OPTION && (
                                    <p className="text-xs font-medium text-[#86868b] mt-1 bg-gray-50 dark:bg-neutral-900 px-2 py-0.5 rounded-md inline-self-start w-max">
                                      {item.merchandise.title}
                                    </p>
                                  )}
                                </Link>
                              </div>

                              <div className="flex flex-col justify-between items-end h-20 flex-shrink-0">
                                <Price
                                  className="text-sm font-semibold tracking-tight text-[#1d1d1f] dark:text-neutral-100"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />

                                <div className="flex h-8 items-center bg-[#f5f5f7] dark:bg-neutral-900 rounded-full p-0.5 border border-gray-100/50 dark:border-neutral-800/40">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-7 text-center select-none">
                                    <span className="t-digit-group is-animating text-xs font-semibold tabular-nums text-[#1d1d1f] dark:text-neutral-200">
                                      <span className="t-digit">
                                        {item.quantity}
                                      </span>
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Summary Calculations */}
                  <div className="pt-6 border-t border-gray-100 dark:border-neutral-800 text-xs text-[#86868b] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Taxes</p>
                      <Price
                        className="text-right text-sm font-medium text-[#1d1d1f] dark:text-white"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Shipping</p>
                      <p className="text-right text-sm font-medium text-[#1d1d1f] dark:text-white">
                        Calculated at checkout
                      </p>
                    </div>
                    <div className="mt-2 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                        Total Amount
                      </p>
                      <Price
                        className="text-right text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-white"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <form action={redirectToCheckout}>
                      <CheckoutButton />
                    </form>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart() {
  return (
    <div className="flex h-8 w-8 items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
      <XMarkIcon className="h-5 w-5" />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-full bg-[#1d1d1f] p-4 text-center text-sm font-semibold text-white tracking-tight hover:bg-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex justify-center items-center h-12 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <LoadingDots className="bg-white dark:bg-black" />
      ) : (
        "Proceed to Checkout"
      )}
    </button>
  );
}
