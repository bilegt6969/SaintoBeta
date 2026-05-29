"use client";

import { processSecureOrder, reserveOrderTxCode } from "app/actions/checkout";
import { wipeCartCookie } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { startTransition, useEffect, useState } from "react";

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

const SHIPPING = 5000;

function formatPrice(amount: number) {
  return `₮ ${amount.toLocaleString()}`;
}

export function CheckoutForm({
  lines,
  subtotalAmount,
  totalAmount,
}: CheckoutFormProps) {
  const { clearCart } = useCart();
  const [step, setStep] = useState<
    "details" | "shipping" | "payment" | "success"
  >("details");
  const [direction, setDirection] = useState(1);
  const [txCode, setTxCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReservingCode, setIsReservingCode] = useState(false);

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
    reserveOrderTxCode()
      .then((result) => {
        if (result.success && result.txCode) {
          setTxCode(result.txCode);
        }
      })
      .finally(() => {
        setIsReservingCode(false);
      });
  }, [step, txCode, isReservingCode]);

  const total = subtotalAmount + SHIPPING;

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

    try {
      // 1. Process the order on the server
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
      // Optionally show error message to user
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canProceedToShipping =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "";

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
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -15 : 15,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  if (step === "success") {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f6",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            ...cardStyle,
            textAlign: "center",
            maxWidth: 440,
            padding: "64px 40px",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "#eef8f1",
              color: "#2ebd59",
              borderRadius: "50%",
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
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#111",
              marginBottom: 8,
            }}
          >
            Order Confirmed
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: 15,
              lineHeight: 1.5,
              marginBottom: 32,
            }}
          >
            Thank you for your purchase. We are verifying your bank transfer
            with code <strong>{txCode}</strong>. We'll email you once it ships.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            style={{ ...primaryBtn(true), width: "100%" }}
          >
            Return to Store
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#f4f4f6",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        color: "#222",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="w-full bg-[#f4f4f6]/70 backdrop-blur-xl border-b border-gray-200/50 flex justify-center flex-shrink-0">
        <div className="w-full max-w-[1040px] px-10 py-4 flex justify-between items-center">
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
            <img
              src="/frame69.svg"
              alt="Brand Logo"
              className="h-full w-auto object-contain invert"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          maxWidth: 1040,
          width: "100%",
          margin: "0 auto",
          padding: "40px 40px 40px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: 56,
          alignItems: "center",
          overflow: "hidden",
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
              marginBottom: 32,
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
                      gap: 10,
                      background: "none",
                      border: "none",
                      cursor: isDone ? "pointer" : "default",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
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
                        fontSize: 11,
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 14,
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
                        width: 40,
                        height: 1,
                        background: isDone ? "#d2d2d7" : "#e5e5ea",
                        margin: "0 16px",
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
                  <div style={cardStyle}>
                    <Header
                      title="Contact details"
                      subtitle="Provide your coordinates for logistics and updates."
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
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
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <Field
                        label="Phone number"
                        type="tel"
                        value={form.phone}
                        onChange={(v: string) => update("phone", v)}
                        placeholder="+976"
                      />
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
                  <div style={cardStyle}>
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
                        gridTemplateColumns: "1fr 1fr",
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
                  <div style={cardStyle}>
                    <Header
                      title="Bank Transfer"
                      subtitle="Finalize your transaction using our direct banking channels."
                    />

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
                          <span style={bankValueStyle}>2900 1500</span>
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
                                color: "#111",
                                background: "#eef0f3",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontFamily: "monospace",
                              }}
                            >
                              {txCode || (isReservingCode ? "Generating..." : "—")}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#777",
                              margin: "8px 0 0 0",
                              lineHeight: 1.4,
                            }}
                          >
                            Please use this exact code as the transaction
                            description so we can automatically authenticate
                            your payment.
                          </p>
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
          <div style={cardStyle}>
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
                  Your cart is empty.
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

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 36,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02), 0 10px 40px rgba(0, 0, 0, 0.03)",
  border: "1px solid rgba(0, 0, 0, 0.03)",
  boxSizing: "border-box",
};

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
  boxShadow: isValid ? "0 4px 14px rgba(0, 0, 0, 0.2)" : "none",
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
