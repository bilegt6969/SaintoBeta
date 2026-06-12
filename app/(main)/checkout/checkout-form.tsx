"use client";

import { processSecureOrder, reserveOrderTxCode } from "app/actions/checkout";
import { wipeCartCookie } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
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
  const { clearCart } = useCart();
  const isMobile = useMediaQuery("(max-width: 768px)");
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
    return phoneRegex.test(phone.replace(/\s/g, ""));
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
    const fullName =
      `${form.firstName} ${form.lastName}`.trim() || "Ishan Zaad";

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
                      {today}
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
                        VISA
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
                          Visa •••• 7347
                        </div>
                      </div>
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
              onClick={() => (window.location.href = "/")}
              style={{
                background: "none",
                border: "none",
                fontSize: "13px",
                color: "#666",
                cursor: "pointer",
                marginBottom: "32px",
                padding: "8px",
              }}
            >
              View invoice & Payment details &gt;
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
    <div
      style={{
        background: "#f4f4f6",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        color: "#222",
        display: isMobile ? "block" : "flex",
        flexDirection: "column",
        height: isMobile ? undefined : "100vh",
        overflow: isMobile ? undefined : "hidden",
      }}
    >
      <div className="w-full bg-[#f4f4f6]/70 backdrop-blur-xl border-b border-gray-200/50 flex justify-center flex-shrink-0">
        <div
          className={`w-full max-w-[1040px] flex justify-between items-center ${
            isMobile ? "px-4 py-3" : "px-10 py-4"
          }`}
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors bg-transparent border-none cursor-pointer p-0"
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
        style={{
          flex: isMobile ? undefined : 1,
          maxWidth: 1040,
          width: "100%",
          margin: "0 auto",
          padding: isMobile ? "20px 16px 20px 16px" : "40px 40px 40px 40px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
          gap: isMobile ? 32 : 56,
          alignItems: isMobile ? "start" : "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: isMobile ? 24 : 32,
            }}
          >
            {steps.map((s, i) => {
              const isActive = s.key === step;
              const isDone = steps.findIndex((x) => x.key === step) > i;
              return (
                <div
                  key={s.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <button
                    onClick={() => isDone && handleStepChange(s.key as any, i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 6 : 10,
                      background: "none",
                      border: "none",
                      cursor: isDone ? "pointer" : "default",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 22 : 26,
                        height: isMobile ? 22 : 26,
                        borderRadius: "50%",
                        background: isActive
                          ? "#ffffff"
                          : isDone
                            ? "#e2e2e7"
                            : "transparent",
                        color: isActive ? "#111" : isDone ? "#666" : "#aaa",
                        border: isActive
                          ? "1px solid rgba(0,0,0,0.08)"
                          : isDone
                            ? "none"
                            : "1px solid #d2d2d7",
                        boxShadow: isActive
                          ? "0 2px 6px rgba(0,0,0,0.04)"
                          : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? 10 : 11,
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#111" : isDone ? "#555" : "#a1a1a6",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        width: isMobile ? 24 : 40,
                        height: 1,
                        background: isDone ? "#d2d2d7" : "#e5e5ea",
                        margin: isMobile ? "0 8px" : "0 16px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ position: "relative" }}>
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
                  <div style={getCardStyle(isMobile)}>
                    <Header
                      title="Contact details"
                      subtitle="Provide your coordinates for logistics and updates."
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 16,
                      }}
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
                    <div style={{ marginTop: 20 }}>
                      <Field
                        label="Email address"
                        type="email"
                        value={form.email}
                        onChange={(v: string) => update("email", v)}
                      />
                      {form.email && !isValidEmail(form.email) && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#dc2626",
                            marginTop: 4,
                          }}
                        >
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <Field
                        label="Phone number"
                        type="tel"
                        value={form.phone}
                        onChange={(v: string) => update("phone", v)}
                        placeholder="+976 "
                      />
                      {form.phone && !isValidPhone(form.phone) && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#dc2626",
                            marginTop: 4,
                          }}
                        >
                          Please enter a valid 8-digit phone number
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        canProceedToShipping && handleStepChange("shipping", 1)
                      }
                      style={primaryBtn(canProceedToShipping)}
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
                  <div style={getCardStyle(isMobile)}>
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
                      style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 16,
                      }}
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
                    <div style={{ marginTop: 20 }}>
                      <label style={labelStyle}>
                        Delivery notes (optional)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="Drop details, secure gates, or preferences..."
                        rows={2}
                        style={{ ...inputStyle, resize: "none" }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        canProceedToPayment && handleStepChange("payment", 2)
                      }
                      style={primaryBtn(canProceedToPayment)}
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
                  <div style={getCardStyle(isMobile)}>
                    <Header
                      title="Bank Transfer"
                      subtitle="Finalize your transaction using our direct banking channels."
                    />

                    {formError && (
                      <div
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: 12,
                          padding: "12px 16px",
                          marginTop: 16,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            color: "#dc2626",
                            margin: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          {formError}
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        background: "#f8f8fa",
                        borderRadius: 16,
                        border: "1px solid #eee",
                        overflow: "hidden",
                        marginTop: 12,
                      }}
                    >
                      <div
                        style={{
                          padding: "14px 20px",
                          background: "#fff",
                          borderBottom: "1px solid #f0f0f3",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: "#333",
                          }}
                        >
                          GOLOMT BANK
                        </span>
                      </div>
                      <div
                        style={{
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        <div style={bankRowStyle}>
                          <span style={bankLabelStyle}>Account Number</span>
                          <span style={bankValueStyle}>3105222445</span>
                        </div>
                        <div style={bankRowStyle}>
                          <span style={bankLabelStyle}>IBAN</span>
                          <span style={bankValueStyle}>29001500</span>
                        </div>
                        <div
                          style={{
                            padding: "14px 16px",
                            background: "#ffffff",
                            borderRadius: 12,
                            border: "1px dashed #d2d2d7",
                            marginTop: 4,
                          }}
                        >
                          <div style={{ ...bankRowStyle, marginBottom: 0 }}>
                            <span
                              style={{
                                ...bankLabelStyle,
                                color: "#111",
                                fontWeight: 600,
                              }}
                            >
                              Dansnii Utga
                            </span>
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: txCodeError ? "#dc2626" : "#111",
                                background: txCodeError ? "#fef2f2" : "#eef0f3",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontFamily: "monospace",
                              }}
                            >
                              {txCodeError
                                ? "Error"
                                : txCode ||
                                  (isReservingCode ? "Generating..." : "—")}
                            </span>
                          </div>
                          {txCodeError && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "#dc2626",
                                margin: "8px 0 0",
                                lineHeight: 1.4,
                              }}
                            >
                              {txCodeError}
                            </p>
                          )}
                          {!txCodeError && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "#777",
                                margin: "8px 0 0",
                                lineHeight: 1.4,
                              }}
                            >
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
                      style={primaryBtn(!isSubmitting)}
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
          <div style={getCardStyle(isMobile)}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: "0 0 24px 0",
                letterSpacing: "-0.01em",
              }}
            >
              Order summary
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                marginBottom: 32,
                maxHeight: "calc(100vh - 400px)",
                overflowY: "auto",
                paddingTop: 10,
                paddingRight: 12,
              }}
            >
              {lines.length === 0 ? (
                <p
                  style={{
                    fontSize: 14,
                    color: "#999",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  Your cart is empty now.
                </p>
              ) : (
                lines.map((line) => (
                  <div
                    key={line.id}
                    style={{ display: "flex", gap: 16, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        background: "#f5f5f5",
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      {line.image && (
                        <Image
                          src={line.image}
                          alt={line.title}
                          fill
                          style={{ objectFit: "cover", borderRadius: 12 }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#111",
                          color: "#fff",
                          fontSize: 11,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        {line.quantity}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {line.title}
                      </div>
                      {line.subtitle && (
                        <div
                          style={{ fontSize: 13, color: "#666", marginTop: 2 }}
                        >
                          {line.subtitle}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {formatPrice(line.price * line.quantity)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ borderTop: "1px solid #f0f0f3", paddingTop: 24 }}>
              <div style={rowStyle}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span>{formatPrice(subtotalAmount)}</span>
              </div>
              <div style={{ ...rowStyle, marginTop: 12 }}>
                <span style={{ color: "#666" }}>Shipping</span>
                <span>{formatPrice(SHIPPING)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: "1px solid #111",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
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
    <div style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 6px 0",
          color: "#111",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "#666", margin: 0, lineHeight: 1.4 }}>
        {subtitle}
      </p>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const getCardStyle = (isMobile: boolean): React.CSSProperties => ({
  background: "#ffffff",
  borderRadius: isMobile ? 20 : 24,
  padding: isMobile ? 24 : 36,
  boxShadow: "0 4px 24px rgba(0,0,0,0.02), 0 10px 40px rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.03)",
  boxSizing: "border-box",
});

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "#fdfdfe",
  border: "1px solid #e2e2e7",
  borderRadius: 12,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
  color: "#111",
};

const primaryBtn = (isValid: boolean): React.CSSProperties => ({
  width: "100%",
  marginTop: 28,
  padding: "16px 24px",
  background: isValid ? "#111111" : "#e2e2e7",
  color: isValid ? "#ffffff" : "#a1a1a6",
  border: "none",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  cursor: isValid ? "pointer" : "not-allowed",
  transition: "all 0.2s ease",
  boxShadow: isValid ? "0 4px 14px rgba(0,0,0,0.2)" : "none",
});

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
};
const bankRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const bankLabelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#666",
  fontWeight: 500,
};
const bankValueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#222",
};
