"use client";

import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { processSecureOrder, reserveOrderTxCode } from "app/actions/checkout";
import { wipeCartCookie } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useMediaQuery } from "../../../hooks/use-media-query";

type CartLine = {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  image?: string;
};

interface CheckoutFormProps {
  lines: CartLine[];
  subtotalAmount: number;
  totalAmount: number;
}

const SHIPPING = 9000;

function formatPrice(amount: number) {
  return `₮${amount.toLocaleString()}`;
}

export function CheckoutForm({
  lines,
  subtotalAmount,
  totalAmount,
}: CheckoutFormProps) {
  const { clearCart, updateCartItem } = useCart();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [step, setStep] = useState<
    "details" | "shipping" | "payment" | "success"
  >("details");
  const [direction, setDirection] = useState(1);
  const [txCode, setTxCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReservingCode, setIsReservingCode] = useState(false);
  const [txCodeError, setTxCodeError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "Ulaanbaatar",
    notes: "",
  });

  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Restore form data from localStorage if available
    const savedForm = localStorage.getItem("checkout-form-data");
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        setForm(parsedForm);
        localStorage.removeItem("checkout-form-data");
      } catch (error) {
        console.error("Failed to restore form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (step !== "payment" || txCode || isReservingCode) {
      return;
    }
    setIsReservingCode(true);
    setTxCodeError("");
    reserveOrderTxCode()
      .then((result) => {
        if (result.success && result.txCode) {
          setTxCode(result.txCode);
        } else {
          setTxCodeError(result.error || "Failed to generate transaction code");
        }
      })
      .catch((err) => {
        setTxCodeError(
          "Failed to generate transaction code. Please try again.",
        );
      })
      .finally(() => {
        setIsReservingCode(false);
      });
  }, [step, txCode, isReservingCode]);

  const total = subtotalAmount + SHIPPING;

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }

  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[\s-]/g, "");
    if (cleaned.length <= 4) return cleaned;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  const steps = [
    { key: "details", label: "Details" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleStepChange(
    newStep: "details" | "shipping" | "payment" | "success",
    index: number,
  ) {
    // Check authentication before proceeding to payment
    if (newStep === "payment" && !user && !loadingAuth) {
      // Save form data to localStorage
      localStorage.setItem("checkout-form-data", JSON.stringify(form));
      // Redirect to sign-in with return URL
      router.push(`/sign-in?next=/checkout`);
      return;
    }

    const currentIndex = steps.findIndex((s) => s.key === step);
    const newIndex = steps.findIndex((s) => s.key === newStep);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setStep(newStep);
  }

  async function finalizeOrder() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError("");

    try {
      const result = await processSecureOrder({ form });
      if (!result.success) {
        throw new Error(result.error || "Order processing failed");
      }
      if (result.txCode) {
        setTxCode(result.txCode);
      }
      await wipeCartCookie();
      startTransition(() => {
        if (clearCart) clearCart();
        setStep("success");
      });
    } catch (err) {
      console.error("Order processing encountered an interruption:", err);
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const canProceedToShipping =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    isValidEmail(form.email) &&
    form.phone.trim() !== "" &&
    isValidPhone(form.phone);

  const canProceedToPayment =
    form.address.trim() !== "" &&
    form.district.trim() !== "" &&
    form.city.trim() !== "";

  const variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? 15 : -15,
      opacity: 0,
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -15 : 15,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  if (step === "success") {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const fullName =
      `${form.firstName} ${form.lastName}`.trim() || "Ishan Zaad";

    const downloadReceipt = () => {
      const receiptContent = `
INVOICE
-------
Invoice Number: ${txCode || "ESTUSFR3S-0012"}
Date: ${today}
Time: ${time}
Customer: ${fullName}
Email: ${form.email}
Phone: ${form.phone}
Address: ${form.address}, ${form.district}, ${form.city}

ORDER ITEMS
-----------
${lines
  .map(
    (line) =>
      `${line.title} ${line.subtitle ? `(${line.subtitle})` : ""} x${line.quantity} - ${formatPrice(line.price * line.quantity)}`,
  )
  .join("\n")}

SUBTOTAL: ${formatPrice(subtotalAmount)}
SHIPPING: ${formatPrice(SHIPPING)}
TOTAL: ${formatPrice(total)}

Payment Method: Bank Transfer
Transaction Code: ${txCode}
      `.trim();

      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${txCode || "order"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          position: "relative",
          padding: isMobile ? "40px 20px" : "0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", padding: "0 4%" }}>
            {/* Receipt Paper */}
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                type: "spring",
                bounce: 0.25,
              }}
              style={{
                background: "#ffffff",
                width: "100%",
                borderRadius: "0 0 8px 8px",
                position: "relative",
                zIndex: 1,
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                paddingBottom: "24px",
              }}
            >
              {/* Jagged Top Edge (SVG Pattern) */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: 0,
                  width: "100%",
                  height: "12px",
                }}
              >
                <svg width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <pattern
                      id="jagged-edge"
                      x="0"
                      y="0"
                      width="16"
                      height="12"
                      patternUnits="userSpaceOnUse"
                    >
                      <polygon points="0,12 8,0 16,12" fill="#ffffff" />
                    </pattern>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#jagged-edge)"
                  />
                </svg>
              </div>

              <div style={{ padding: "40px 32px 16px", textAlign: "center" }}>
                {/* Success Icon */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "#e2f6ed",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="4"
                      width="14"
                      height="16"
                      rx="2"
                      fill="#2ebd59"
                    />
                    <path
                      d="M9 9H15"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 13H12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="5"
                      fill="#2ebd59"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M14.5 16.5L15.5 17.5L18 14.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "#111",
                  }}
                >
                  Thank you!
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    margin: "0 0 28px 0",
                    lineHeight: 1.5,
                  }}
                >
                  Your order has been placed
                  <br />
                  successfully
                </p>

                <div
                  style={{
                    borderTop: "2px dashed #f0f0f3",
                    margin: "0 0 24px 0",
                  }}
                />

                {/* Invoice Details */}
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginBottom: "4px",
                      }}
                    >
                      Invoice number
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#111",
                      }}
                    >
                      {txCode || "ESTUSFR3S-0012"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginBottom: "4px",
                      }}
                    >
                      Payment Date
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#111",
                      }}
                    >
                      {today} at {time}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginBottom: "8px",
                      }}
                    >
                      Payment Method
                    </div>
                    <div
                      style={{
                        background: "#f4f4f6",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          color: "#1434CB",
                          fontWeight: 800,
                          fontSize: "18px",
                          fontStyle: "italic",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        BANK TRANSFER
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#111",
                            marginBottom: "2px",
                          }}
                        >
                          {fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Golomt Bank
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginBottom: "8px",
                      }}
                    >
                      Order Items
                    </div>
                    <div
                      style={{
                        background: "#fafafa",
                        borderRadius: "8px",
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {lines.map((line) => (
                        <div
                          key={line.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span style={{ color: "#333" }}>
                            {line.title} {line.subtitle && `(${line.subtitle})`}{" "}
                            x{line.quantity}
                          </span>
                          <span style={{ fontWeight: 500, color: "#111" }}>
                            {formatPrice(line.price * line.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Printer Slot (The black bar) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "36px",
              background: "linear-gradient(180deg, #222 0%, #000 100%)",
              borderRadius: "18px",
              position: "relative",
              zIndex: 10,
              marginTop: "-18px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255,255,255,0.15)",
            }}
          >
            {/* Slot inner shadow to look hollow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "6%",
                right: "6%",
                height: "4px",
                background: "#000",
                transform: "translateY(-50%)",
                borderRadius: "2px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,1)",
              }}
            />
          </motion.div>

          {/* Bottom Call to Action */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{ textAlign: "center", marginTop: "32px", width: "100%" }}
          >
            <div
              style={{ fontSize: "15px", color: "#555", marginBottom: "8px" }}
            >
              Payment Successful
            </div>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 800,
                color: "#111",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(total)}
            </div>

            <button
              onClick={downloadReceipt}
              style={{
                background: "none",
                border: "none",
                fontSize: "13px",
                color: "#666",
                cursor: "pointer",
                marginBottom: "16px",
                padding: "8px",
              }}
            >
              Download Receipt &gt;
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "#1e1e1e",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                padding: "16px 28px",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "0 auto",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Return to home page
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] text-neutral-900 antialiased min-h-screen">
      <div className="w-full bg-white/70 backdrop-blur-xl border-b border-neutral-200/50 flex justify-center flex-shrink-0">
        <div
          className={`w-full max-w-[1040px] flex justify-between items-center ${
            isMobile ? "px-4 py-3" : "px-10 py-4"
          }`}
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center h-5">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-transparent border-none cursor-pointer p-0 h-5 flex items-center"
            >
              <img
                src="/Lelogo.svg"
                alt="Brand Logo"
                className="h-full w-auto object-contain invert"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 max-w-[1040px] w-full mx-auto ${
          isMobile ? "p-4" : "p-10"
        } grid ${isMobile ? "grid-cols-1" : "grid-cols-[1fr_400px]"} gap-8 ${
          isMobile ? "items-start" : "items-center"
        }`}
      >
        <div className="flex flex-col justify-center">
          <div
            className={`flex items-center justify-center ${
              isMobile ? "mb-6" : "mb-8"
            }`}
          >
            {steps.map((s, i) => {
              const isActive = s.key === step;
              const isDone = steps.findIndex((x) => x.key === step) > i;
              return (
                <div key={s.key} className="flex items-center">
                  <button
                    onClick={() => isDone && handleStepChange(s.key as any, i)}
                    className={`flex items-center ${
                      isMobile ? "gap-1.5" : "gap-2.5"
                    } bg-transparent border-none cursor-${
                      isDone ? "pointer" : "default"
                    } p-0`}
                  >
                    <div
                      className={`flex items-center justify-center ${
                        isMobile
                          ? "w-[22px] h-[22px] text-[10px]"
                          : "w-[26px] h-[26px] text-[11px]"
                      } rounded-full font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-neutral-900 border border-neutral-200 shadow-sm"
                          : isDone
                            ? "bg-neutral-200 text-neutral-600 border-none"
                            : "bg-transparent text-neutral-400 border border-neutral-300"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-neutral-900"
                          : isDone
                            ? "text-neutral-600"
                            : "text-neutral-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px ${
                        isMobile ? "w-6 mx-2" : "w-10 mx-4"
                      } ${isDone ? "bg-neutral-300" : "bg-neutral-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              {step === "details" && (
                <motion.div
                  key="details"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div
                    className={`bg-white rounded-2xl border border-neutral-200/50 shadow-sm ${
                      isMobile ? "p-6" : "p-9"
                    }`}
                  >
                    <Header
                      title="Contact details"
                      subtitle="Provide your coordinates for logistics and updates."
                    />
                    <div
                      className={`grid ${
                        isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4`}
                    >
                      <Field
                        label="First name"
                        value={form.firstName}
                        onChange={(v: string) => update("firstName", v)}
                      />
                      <Field
                        label="Last name"
                        value={form.lastName}
                        onChange={(v: string) => update("lastName", v)}
                      />
                    </div>
                    <div className="mt-5">
                      <Field
                        label="Email address"
                        type="email"
                        value={form.email}
                        onChange={(v: string) => update("email", v)}
                      />
                      {form.email && !isValidEmail(form.email) && (
                        <p className="text-xs text-red-600 mt-1">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    <div className="mt-5">
                      <Field
                        label="Phone number"
                        type="tel"
                        value={form.phone}
                        onChange={(v: string) =>
                          update("phone", formatPhoneNumber(v))
                        }
                        placeholder="+976 "
                      />
                      {form.phone && !isValidPhone(form.phone) && (
                        <p className="text-xs text-red-600 mt-1">
                          Please enter a valid 8-digit phone number
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        canProceedToShipping && handleStepChange("shipping", 1)
                      }
                      className={`w-full mt-7 px-6 py-4 rounded-full text-sm font-semibold transition-all ${
                        canProceedToShipping
                          ? "bg-neutral-900 text-white shadow-lg hover:shadow-xl hover:bg-neutral-800"
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                      disabled={!canProceedToShipping}
                    >
                      Continue to shipping
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "shipping" && (
                <motion.div
                  key="shipping"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div
                    className={`bg-white rounded-2xl border border-neutral-200/50 shadow-sm ${
                      isMobile ? "p-6" : "p-9"
                    }`}
                  >
                    <Header
                      title="Delivery address"
                      subtitle="Orders are dispatched reliably across Ulaanbaatar."
                    />
                    <Field
                      label="Street address"
                      value={form.address}
                      onChange={(v: string) => update("address", v)}
                      placeholder="Khoroo, building, apartment..."
                    />
                    <div
                      className={`mt-5 grid ${
                        isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4`}
                    >
                      <Field
                        label="District"
                        value={form.district}
                        onChange={(v: string) => update("district", v)}
                        placeholder="Sükhbaatar, Chingeltei..."
                      />
                      <Field
                        label="City"
                        value={form.city}
                        onChange={(v: string) => update("city", v)}
                      />
                    </div>
                    <div className="mt-5">
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                        Delivery notes (optional)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="Drop details, secure gates, or preferences..."
                        rows={2}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-200 text-neutral-900 resize-none"
                      />
                    </div>
                    <button
                      onClick={() =>
                        canProceedToPayment && handleStepChange("payment", 2)
                      }
                      className={`w-full mt-7 px-6 py-4 rounded-full text-sm font-semibold transition-all ${
                        canProceedToPayment
                          ? "bg-neutral-900 text-white shadow-lg hover:shadow-xl hover:bg-neutral-800"
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                      disabled={!canProceedToPayment}
                    >
                      Continue to payment
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div
                    className={`bg-white rounded-2xl border border-neutral-200/50 shadow-sm ${
                      isMobile ? "p-6" : "p-9"
                    }`}
                  >
                    <Header
                      title="Bank Transfer"
                      subtitle="Finalize your transaction using our direct banking channels."
                    />

                    {formError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
                        <p className="text-sm text-red-600 m-0 leading-relaxed">
                          {formError}
                        </p>
                      </div>
                    )}

                    <div className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden mt-3">
                      <div className="px-5 py-3.5 bg-white border-b border-neutral-200 flex items-center gap-2.5">
                        <span className="text-sm font-bold tracking-tight text-neutral-800">
                          GOLOMT BANK
                        </span>
                      </div>
                      <div className="p-5 flex flex-col gap-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600 font-medium">
                            Account Number
                          </span>
                          <span className="text-sm font-semibold text-neutral-900">
                            3105222445
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600 font-medium">
                            IBAN
                          </span>
                          <span className="text-sm font-semibold text-neutral-900">
                            29001500
                          </span>
                        </div>
                        <div className="px-4 py-3.5 bg-white rounded-xl border border-dashed border-neutral-300 mt-1">
                          <div className="flex justify-between items-center mb-0">
                            <span className="text-sm text-neutral-900 font-semibold">
                              Dansnii Utga
                            </span>
                            <span
                              className={`text-sm font-bold px-2.5 py-1 rounded-md font-mono ${
                                txCodeError
                                  ? "text-red-600 bg-red-50"
                                  : "text-neutral-900 bg-neutral-200"
                              }`}
                            >
                              {txCodeError
                                ? "Error"
                                : txCode ||
                                  (isReservingCode ? "Generating..." : "—")}
                            </span>
                          </div>
                          {txCodeError && (
                            <p className="text-xs text-red-600 mt-2 leading-relaxed">
                              {txCodeError}
                            </p>
                          )}
                          {!txCodeError && (
                            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                              Please use this exact code as the transaction
                              description so we can automatically authenticate
                              your payment.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={finalizeOrder}
                      className={`w-full mt-7 px-6 py-4 rounded-full text-sm font-semibold transition-all ${
                        !isSubmitting && txCode
                          ? "bg-neutral-900 text-white shadow-lg hover:shadow-xl hover:bg-neutral-800"
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                      disabled={isSubmitting || !txCode}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "I have completed the transfer"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div
            className={`bg-white rounded-2xl border border-neutral-200/50 shadow-sm ${
              isMobile ? "p-6" : "p-9"
            }`}
          >
            <h3 className="text-base font-semibold mb-6 tracking-tight">
              Order summary
            </h3>
            <div className="flex flex-col gap-5 mb-8 max-h-[calc(100vh-400px)] overflow-y-auto pt-2.5 pr-3">
              {lines.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center m-0">
                  Your cart is empty now.
                </p>
              ) : (
                lines.map((line) => (
                  <div key={line.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 relative flex-shrink-0 overflow-hidden">
                      {line.image && (
                        <Image
                          src={line.image}
                          alt={line.title}
                          fill
                          className="object-cover rounded-xl"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900">
                        {line.title}
                      </div>
                      {line.subtitle && (
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {line.subtitle}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartItem(line.id, "minus")}
                          disabled={line.quantity <= 1}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center p-0 transition-all ${
                            line.quantity <= 1
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50"
                          }`}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium min-w-5 text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItem(line.id, "plus")}
                          className="w-7 h-7 rounded-lg border border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center p-0 transition-all"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">
                        {formatPrice(line.price * line.quantity)}
                      </div>
                      <button
                        onClick={() => updateCartItem(line.id, "delete")}
                        className="bg-transparent border-none text-red-600 text-xs cursor-pointer p-0 mt-1 font-medium hover:text-red-700 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-neutral-200 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(subtotalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-neutral-600">Shipping</span>
                <span>{formatPrice(SHIPPING)}</span>
              </div>
              <div className="flex justify-between mt-6 pt-6 border-t border-neutral-900 text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-xl font-semibold tracking-tight m-0 mb-1.5 text-neutral-900">
        {title}
      </h2>
      <p className="text-sm text-neutral-600 m-0 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-xs font-medium text-neutral-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-200 text-neutral-900"
      />
    </div>
  );
}
