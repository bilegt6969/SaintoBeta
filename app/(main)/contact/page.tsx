"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

// ─── Easing ──────────────────────────────────────────────────────────────────
const spring = { type: "spring" as const, stiffness: 380, damping: 30 };
const appleEase = [0.25, 0.1, 0.25, 1.0] as const;
const softReveal = { duration: 0.7, ease: appleEase as any };

// ─── Floating Label Input ─────────────────────────────────────────────────────
interface FloatingFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  autoComplete?: string;
}

function FloatingField({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  multiline = false,
  rows = 4,
  required,
  autoComplete,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const baseStyles: React.CSSProperties = {
    width: "100%",
    background: error ? "#FFF1F0" : focused ? "#FFFFFF" : "#F5F5F7",
    border: `1.5px solid ${
      error ? "#FF3B30" : focused ? "#1D1D1F" : "transparent"
    }`,
    borderRadius: 14,
    padding: multiline ? "28px 18px 12px" : "26px 18px 10px",
    fontSize: 15,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
    fontWeight: 400,
    color: "#1D1D1F",
    outline: "none",
    transition: "background 0.25s ease, border-color 0.25s ease",
    resize: "none" as const,
    boxSizing: "border-box" as const,
    lineHeight: 1.5,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <motion.label
        htmlFor={id}
        animate={{
          y: lifted ? -8 : 0,
          scale: lifted ? 0.78 : 1,
          color: error ? "#FF3B30" : focused ? "#0071E3" : "#86868B",
        }}
        transition={spring}
        style={{
          position: "absolute",
          left: 18,
          top: multiline ? 16 : "50%",
          translateY: multiline ? 0 : "-50%",
          transformOrigin: "left center",
          fontSize: 15,
          fontWeight: 500,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          pointerEvents: "none",
          zIndex: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
        {required && <span style={{ color: "#FF3B30", marginLeft: 3 }}>*</span>}
      </motion.label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : undefined}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{ ...baseStyles, display: "block" }}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : undefined}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{ ...baseStyles, display: "block", height: 58 }}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={softReveal}
            style={{
              fontSize: 12,
              color: "#FF3B30",
              marginTop: 5,
              marginLeft: 4,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Floating Select ──────────────────────────────────────────────────────────
interface FloatingSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

function FloatingSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  required,
}: FloatingSelectProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <motion.label
        htmlFor={id}
        animate={{
          y: hasValue ? -8 : 0,
          scale: hasValue ? 0.78 : 1,
          color: error ? "#FF3B30" : focused ? "#0071E3" : "#86868B",
        }}
        transition={spring}
        style={{
          position: "absolute",
          left: 18,
          top: "50%",
          translateY: "-50%",
          transformOrigin: "left center",
          fontSize: 15,
          fontWeight: 500,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          pointerEvents: "none",
          zIndex: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
        {required && <span style={{ color: "#FF3B30", marginLeft: 3 }}>*</span>}
      </motion.label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: "100%",
          height: 58,
          background: error ? "#FFF1F0" : focused ? "#FFFFFF" : "#F5F5F7",
          border: `1.5px solid ${
            error ? "#FF3B30" : focused ? "#1D1D1F" : "transparent"
          }`,
          borderRadius: 14,
          padding: hasValue ? "16px 44px 8px 18px" : "0 44px 0 18px",
          fontSize: 15,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontWeight: 400,
          color: hasValue ? "#1D1D1F" : "transparent",
          outline: "none",
          transition: "background 0.25s ease, border-color 0.25s ease",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <option value="" disabled />
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <svg
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#86868B",
        }}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={softReveal}
            style={{
              fontSize: 12,
              color: "#FF3B30",
              marginTop: 5,
              marginLeft: 4,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stagger Variants ─────────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: appleEase },
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "error" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    inquiryType: "",
    companySize: "",
    companyName: "",
    firstName: "",
    lastName: "",
    workEmail: "",
    phoneNumber: "",
    productInterest: "",
    businessNeeds: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  type Key = keyof typeof formData;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const resetForm = () => {
    setFormData({
      inquiryType: "",
      companySize: "",
      companyName: "",
      firstName: "",
      lastName: "",
      workEmail: "",
      phoneNumber: "",
      productInterest: "",
      businessNeeds: "",
    });
    setFormStatus("idle");
    setErrorMessage("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const required: Key[] = [
      "inquiryType",
      "firstName",
      "lastName",
      "workEmail",
      "phoneNumber",
      "productInterest",
    ];
    if (formData.inquiryType === "company")
      required.push("companySize", "companyName");

    const newErrors: Record<string, string> = {};
    required.forEach((f) => {
      if (!formData[f]?.trim()) newErrors[f] = "Энэ талбарыг бөглөнө үү.";
    });
    if (
      formData.workEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)
    )
      newErrors.workEmail = "Бодит имэйл хаяг оруулна уу.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setErrorMessage("Шаардлагатай бүх талбарыг бөглөнө үү.");
      return;
    }

    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
        setErrorMessage("Хүсэлт илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch {
      setFormStatus("error");
      setErrorMessage("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const ff = {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F5F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        ...ff,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: appleEase }}
        style={{
          width: "100%",
          maxWidth: 960,
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 24px 56px rgba(0,0,0,0.06)",
          background: "#FFFFFF",
        }}
        className="contact-card"
      >
        {/* ── LEFT ── */}
        <aside
          style={{
            width: "40%",
            minWidth: 280,
            background: "#111111",
            padding: "56px 48px 64px", // Bottom heavier padding
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
          className="contact-aside"
        >
          {/* Ambient glow — purely decorative */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 60% at 20% 110%, rgba(0,113,227,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 90% -10%, rgba(100,100,255,0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Logo */}
            <div style={{ marginBottom: 52 }}>
              <Image
                src="/lelogo.svg"
                alt="Sainto"
                width={120}
                height={40}
                style={{ height: 28, width: "auto", opacity: 0.9 }}
              />
            </div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              style={{
                fontSize: 34,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#F5F5F7",
                margin: "0 0 20px",
              }}
            >
              Борлуулалтын
              <br />
              багтай холбогдох
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: appleEase }}
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "#888888",
                fontWeight: 400,
                maxWidth: 260,
              }}
            >
              Хамтран ажиллах шинэ санаа байна уу? Бид үргэлж шинэ боломжуудад
              нээлттэй.
            </motion.p>
          </div>

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: appleEase }}
            style={{ position: "relative" }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#444444",
                marginBottom: 18,
              }}
            >
              Шууд холбогдох
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  href: "mailto:bilegt6969@gmail.com",
                  label: "bilegt6969@gmail.com",
                },
                { href: "tel:+97690195589", label: "+(976) 9019 5589" },
                {
                  href: "https://www.instagram.com/sainto.app/",
                  label: "Instagram ↗",
                },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#888888",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#F5F5F7")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#888888")
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* ── RIGHT ── */}
        <div
          style={{
            flex: 1,
            padding: "56px 52px 64px", // Bottom heavier padding
            background: "#FFFFFF",
            overflowY: "auto",
          }}
          className="contact-form-wrapper"
        >
          <AnimatePresence mode="wait">
            {formStatus === "success" ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: appleEase }}
                style={{
                  height: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                {/* Checkmark circle */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "#F5F5F7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1D1D1F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M5 12l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: appleEase,
                      }}
                    />
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: "#1D1D1F",
                    margin: "0 0 12px",
                  }}
                >
                  Хүсэлт амжилттай
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: "#86868B",
                    lineHeight: 1.6,
                    maxWidth: 320,
                    marginBottom: 36,
                  }}
                >
                  Манай борлуулалтын баг тантай удахгүй холбогдох болно.
                </p>

                <button
                  onClick={resetForm}
                  style={{
                    background: "#F5F5F7",
                    border: "none",
                    borderRadius: 980,
                    padding: "12px 28px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1D1D1F",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    ...ff,
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.background = "#E5E5EA")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.background = "#F5F5F7")
                  }
                >
                  Дахин илгээх
                </button>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.form
                key="form"
                variants={listVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                noValidate
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {/* Heading */}
                <motion.div variants={rowVariants} style={{ marginBottom: 4 }}>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      color: "#1D1D1F",
                      margin: "0 0 6px",
                    }}
                  >
                    Мэдээлэл үлдээх
                  </h2>
                  <p style={{ fontSize: 14, color: "#86868B", margin: 0 }}>
                    <span style={{ color: "#FF3B30" }}>*</span> тэмдэгтэй
                    талбарыг заавал бөглөнө үү
                  </p>
                </motion.div>

                {/* Who are you */}
                <motion.div variants={rowVariants}>
                  <FloatingSelect
                    id="inquiryType"
                    name="inquiryType"
                    label="Та хэн бэ?"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    error={errors.inquiryType}
                    options={[
                      { value: "person", label: "Хувь хүн" },
                      { value: "company", label: "Компани" },
                    ]}
                  />
                </motion.div>

                {/* Company fields */}
                <AnimatePresence>
                  {formData.inquiryType === "company" && (
                    <motion.div
                      key="company-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: appleEase }}
                      style={{
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                      }}
                    >
                      <FloatingSelect
                        id="companySize"
                        name="companySize"
                        label="Компанийн хэмжээ"
                        value={formData.companySize}
                        onChange={handleChange}
                        required
                        error={errors.companySize}
                        options={[
                          { value: "1-10 ажилтантай", label: "1–10 ажилтан" },
                          { value: "11-50 ажилтантай", label: "11–50 ажилтан" },
                          {
                            value: "51-200 ажилтантай",
                            label: "51–200 ажилтан",
                          },
                          {
                            value: "201-500 ажилтантай",
                            label: "201–500 ажилтан",
                          },
                          { value: "500+ ажилтантай", label: "500+ ажилтан" },
                        ]}
                      />
                      <FloatingField
                        id="companyName"
                        name="companyName"
                        label="Компанийн нэр"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        error={errors.companyName}
                        placeholder="Жишээ нь: Sainto ХХК"
                        autoComplete="organization"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name row */}
                <motion.div
                  variants={rowVariants}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                  className="name-grid"
                >
                  <FloatingField
                    id="firstName"
                    name="firstName"
                    label="Нэр"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    error={errors.firstName}
                    autoComplete="given-name"
                  />
                  <FloatingField
                    id="lastName"
                    name="lastName"
                    label="Овог"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </motion.div>

                {/* Email + Phone row */}
                <motion.div
                  variants={rowVariants}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                  className="contact-grid"
                >
                  <FloatingField
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    label="Ажлын имэйл"
                    value={formData.workEmail}
                    onChange={handleChange}
                    required
                    error={errors.workEmail}
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                  <FloatingField
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    label="Утасны дугаар"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    error={errors.phoneNumber}
                    placeholder="9911 2233"
                    autoComplete="tel"
                  />
                </motion.div>

                {/* What's your question */}
                <motion.div variants={rowVariants}>
                  <FloatingSelect
                    id="productInterest"
                    name="productInterest"
                    label="Та ямар асуулттай байна вэ?"
                    value={formData.productInterest}
                    onChange={handleChange}
                    required
                    error={errors.productInterest}
                    options={[
                      {
                        value: "Захиалгын талаар асуух",
                        label: "Захиалгын талаар асуух",
                      },
                      {
                        value: "Бүтээгдэхүүний талаар мэдэх",
                        label: "Бүтээгдэхүүний талаар мэдэх",
                      },
                      {
                        value: "Буцаалт, солилцоо",
                        label: "Буцаалт, солилцоо",
                      },
                      {
                        value: "Түншлэлийн лавлагаа",
                        label: "Түншлэлийн лавлагаа",
                      },
                      {
                        value: "Худалдагчийн бүртгэлийн дэмжлэг",
                        label: "Худалдагчийн бүртгэлийн дэмжлэг",
                      },
                      {
                        value: "Бөөнөөр худалдан авах",
                        label: "Бөөнөөр худалдан авах",
                      },
                      { value: "Бусад", label: "Бусад" },
                    ]}
                  />
                </motion.div>

                {/* Additional info */}
                <motion.div variants={rowVariants}>
                  <FloatingField
                    id="businessNeeds"
                    name="businessNeeds"
                    label="Нэмэлт мэдээлэл"
                    value={formData.businessNeeds}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Бидэнд юу хэлэхийг хүсэж байна вэ?"
                  />
                </motion.div>

                {/* Submit row */}
                <motion.div
                  variants={rowVariants}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    paddingTop: 4,
                  }}
                >
                  <motion.button
                    disabled={formStatus === "submitting"}
                    whileHover={
                      formStatus !== "submitting" ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      formStatus !== "submitting" ? { scale: 0.97 } : {}
                    }
                    transition={spring}
                    type="submit"
                    style={{
                      background:
                        formStatus === "submitting" ? "#86868B" : "#0071E3",
                      border: "none",
                      borderRadius: 980,
                      padding: "14px 32px",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#FFFFFF",
                      cursor:
                        formStatus === "submitting" ? "not-allowed" : "pointer",
                      letterSpacing: "-0.01em",
                      transition: "background 0.2s ease, opacity 0.2s ease",
                      opacity: formStatus === "submitting" ? 0.8 : 1,
                      boxShadow: "0 4px 12px rgba(0, 113, 227, 0.15)", // Anchoring shadow
                      ...ff,
                    }}
                    onMouseEnter={(e) => {
                      if (formStatus !== "submitting") {
                        (e.target as HTMLElement).style.background = "#0077ED";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formStatus !== "submitting") {
                        (e.target as HTMLElement).style.background = "#0071E3";
                      }
                    }}
                  >
                    {formStatus === "submitting" ? "Илгээж байна..." : "Илгээх"}
                  </motion.button>

                  <AnimatePresence>
                    {(formStatus === "error" || errorMessage) && (
                      <motion.p
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={softReveal}
                        style={{
                          fontSize: 13,
                          color: "#FF3B30",
                          margin: 0,
                        }}
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 760px) {
          .contact-card {
            flex-direction: column !important;
          }
          .contact-aside {
            width: 100% !important;
            padding: 40px 32px !important;
            min-height: 260px;
          }
          .contact-form-wrapper {
            padding: 40px 28px !important;
          }
          .name-grid,
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
