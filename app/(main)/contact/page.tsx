"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

// The smooth physical momentum curve
const smoothEase = [0.32, 0.72, 0, 1] as const;

// Updated to a light, Apple-style tactile input
const fieldBase =
  "w-full rounded-2xl border border-transparent bg-neutral-100/80 px-4 py-3.5 text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 transition-all focus:bg-white focus:border-neutral-200 focus:outline-none focus:ring-4 focus:ring-neutral-100";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState("");
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
  const [showSubmitAgain, setShowSubmitAgain] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  type FormDataKeys = keyof typeof formData;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (formStatus && !showSubmitAgain) {
      setFormStatus("");
    }
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
    setFormStatus("");
    setShowSubmitAgain(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    const requiredFields: FormDataKeys[] = [
      "inquiryType",
      "firstName",
      "lastName",
      "workEmail",
      "phoneNumber",
      "productInterest",
    ];

    // If company inquiry, require company fields
    if (formData.inquiryType === "company") {
      requiredFields.push("companySize", "companyName");
    }

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = "Энэ талбарыг бөглөнө үү.";
      }
    });

    if (
      formData.workEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)
    ) {
      newErrors.workEmail = "Бодит имэйл хаяг оруулна уу.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormStatus(
        "Шаардлагатай бүх талбарыг бөглөнө үү эсвэл алдааг засна уу.",
      );
      setShowSubmitAgain(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setFormStatus(
          "Баярлалаа! Манай борлуулалтын баг тантай удахгүй холбогдох болно.",
        );
        setShowSubmitAgain(true);
        setErrors({});
      } else {
        setFormStatus("Хүсэлт илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
        setShowSubmitAgain(false);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setFormStatus("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
      setShowSubmitAgain(false);
    }
  };

  // Updated error styling for the light theme
  const inputError = (name: string) =>
    errors[name]
      ? "!border-red-300 !bg-red-50/50 focus:!border-red-400 focus:!ring-red-100"
      : "";

  // Darkened the chevron SVG for the light background
  const selectChevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;

  return (
    <div className="relative min-h-screen bg-white font-inter antialiased selection:bg-neutral-200 selection:text-neutral-900 pb-32">
      <div className="page-container relative z-10 pt-12 md:pt-20">
        <div className="container mx-auto max-w-5xl px-6">
          {/* Breadcrumbs */}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="flex flex-col lg:flex-row overflow-hidden bg-white rounded-[32px] border border-neutral-200/60 shadow-[0_16px_40px_-4px_rgba(0,0,0,0.04)]"
          >
            {/* LEFT COLUMN: Context / Aside */}
            <aside className="bg-neutral-900 p-8 md:p-12 lg:w-5/12 border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <Image
                    src="/lelogo.svg"
                    alt="Sainto Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                  Борлуулалтын багтай холбогдох
                </h1>
                <p className="text-[15px] leading-relaxed text-neutral-400 font-medium tracking-tight">
                  Хамтран ажиллах шинэ санаа байна уу? Тэгвэл Sainto-той хамт
                  эхэлье.
                </p>
              </div>

              <div className="mt-12 space-y-4 pt-8">
                <p className="text-[13px] font-bold text-white">
                  Шууд холбогдох
                </p>
                <a
                  href="mailto:bilegt6969@gmail.com"
                  className="block text-[15px] font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  bilegt6969@gmail.com
                </a>
                <a
                  href="tel:+97690195589"
                  className="block text-[15px] font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  +(976)90195589
                </a>
                <a
                  href="https://www.instagram.com/sainto.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[15px] font-bold text-white hover:text-neutral-300 transition-colors"
                >
                  Instagram
                </a>
              </div>
            </aside>

            {/* RIGHT COLUMN: The Form */}
            <div className="p-8 md:p-12 lg:w-7/12">
              {!showSubmitAgain ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="inquiryType"
                      className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                    >
                      Та хэн бэ? <span className="text-neutral-400">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className={`${fieldBase} ${inputError("inquiryType")} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={{ backgroundImage: selectChevron }}
                    >
                      <option value="" disabled className="text-neutral-500">
                        Сонгоно уу
                      </option>
                      <option value="person">Хувь хүн</option>
                      <option value="company">Компани</option>
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                        {errors.inquiryType}
                      </p>
                    )}
                  </div>

                  {formData.inquiryType === "company" && (
                    <>
                      <div>
                        <label
                          htmlFor="companySize"
                          className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                        >
                          Компанийн хэмжээ{" "}
                          <span className="text-neutral-400">*</span>
                        </label>
                        <select
                          id="companySize"
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className={`${fieldBase} ${inputError("companySize")} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
                          style={{ backgroundImage: selectChevron }}
                        >
                          <option
                            value=""
                            disabled
                            className="text-neutral-500"
                          >
                            Сонгоно уу
                          </option>
                          <option value="1-10 ажилтантай">
                            1-10 ажилтантай
                          </option>
                          <option value="11-50 ажилтантай">
                            11-50 ажилтантай
                          </option>
                          <option value="51-200 ажилтантай">
                            51-200 ажилтантай
                          </option>
                          <option value="201-500 ажилтантай">
                            201-500 ажилтантай
                          </option>
                          <option value="500+ ажилтантай">
                            500+ ажилтантай
                          </option>
                        </select>
                        {errors.companySize && (
                          <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                            {errors.companySize}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="companyName"
                          className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                        >
                          Компанийн нэр{" "}
                          <span className="text-neutral-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`${fieldBase} ${inputError("companyName")}`}
                        />
                        {errors.companyName && (
                          <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                            {errors.companyName}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                      >
                        Нэр <span className="text-neutral-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`${fieldBase} ${inputError("firstName")}`}
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                      >
                        Овог <span className="text-neutral-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`${fieldBase} ${inputError("lastName")}`}
                      />
                      {errors.lastName && (
                        <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="workEmail"
                        className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                      >
                        Ажлын имэйл <span className="text-neutral-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="workEmail"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        className={`${fieldBase} ${inputError("workEmail")}`}
                      />
                      {errors.workEmail && (
                        <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                          {errors.workEmail}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                      >
                        Утасны дугаар{" "}
                        <span className="text-neutral-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`${fieldBase} ${inputError("phoneNumber")}`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="productInterest"
                      className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                    >
                      Та ямар асуулттай байна вэ?{" "}
                      <span className="text-neutral-400">*</span>
                    </label>
                    <select
                      id="productInterest"
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleInputChange}
                      className={`${fieldBase} ${inputError("productInterest")} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={{ backgroundImage: selectChevron }}
                    >
                      <option value="" disabled className="text-neutral-500">
                        Доорх сонголтуудаас нэгийг сонгоно уу
                      </option>
                      <option value="Захиалгын талаар асуух">
                        Захиалгын талаар асуух
                      </option>
                      <option value="Бүтээгдэхүүний талаар мэдэх">
                        Бүтээгдэхүүний талаар мэдэх
                      </option>
                      <option value="Буцаалт, солилцоо">
                        Буцаалт, солилцоо
                      </option>
                      <option value="Түншлэлийн лавлагаа">
                        Түншлэлийн лавлагаа
                      </option>
                      <option value="Худалдагчийн бүртгэлийн дэмжлэг">
                        Худалдагчийн бүртгэлийн дэмжлэг
                      </option>
                      <option value="Бөөнөөр худалдан авах">
                        Бөөнөөр худалдан авах
                      </option>
                      <option value="Бусад">Бусад</option>
                    </select>
                    {errors.productInterest && (
                      <p className="mt-1.5 text-[13px] font-medium text-red-500 ml-1">
                        {errors.productInterest}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="businessNeeds"
                      className="mb-1.5 block text-[13px] font-bold text-neutral-900 ml-1"
                    >
                      Нэмэлт мэдээлэл
                    </label>
                    <textarea
                      id="businessNeeds"
                      name="businessNeeds"
                      value={formData.businessNeeds}
                      onChange={handleInputChange}
                      rows={4}
                      className={`${fieldBase} resize-none`}
                      placeholder="Асуух зүйлээ бичнэ үү..."
                    />
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ ease: smoothEase, duration: 0.3 }}
                      type="submit"
                      className="w-full md:w-auto rounded-full bg-neutral-900 px-8 py-3.5 text-[15px] font-bold tracking-tight text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-200"
                    >
                      Илгээх
                    </motion.button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-neutral-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Хүсэлт амжилттай илгээгдлээ
                  </h3>
                  <p className="text-[15px] leading-relaxed text-neutral-500 max-w-sm mb-8">
                    {formStatus}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="rounded-full bg-neutral-100 px-6 py-3 text-[14px] font-bold text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  >
                    Дахин илгээх
                  </motion.button>
                </motion.div>
              )}

              {/* Error Banner - Updated for light theme */}
              {formStatus && !showSubmitAgain && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="text-center text-[14px] font-medium text-red-600">
                    {formStatus}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
