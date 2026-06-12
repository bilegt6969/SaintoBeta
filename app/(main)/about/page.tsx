"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React from "react";

// The Apple-style physical momentum curve from your Navbar
const smoothEase = [0.32, 0.72, 0, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeUpVariants}
    className="mt-16 md:mt-20"
  >
    <h2 className="text-xl md:text-[22px] font-bold tracking-tight text-neutral-900 mb-4">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </motion.section>
);

const P = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-[15px] leading-normal text-neutral-500 font-medium tracking-tight ${className}`}
  >
    {children}
  </p>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-[15px] leading-normal text-neutral-500 font-medium tracking-tight">
    <span className="text-neutral-400 mt-[1px]">·</span>
    <span>{children}</span>
  </li>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#ffffff] font-inter antialiased selection:bg-neutral-200 selection:text-neutral-900 pb-32">
      <article className="max-w-[700px] mx-auto px-6 pt-32 md:pt-40">
        {/* HEADER SECTION */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            About Sainto (Le Finds)
          </h1>
          <p className="text-[11px] font-bold tracking-[0.08em] text-neutral-500 uppercase mb-6">
            We&apos;re not a marketplace. Yet.
          </p>
          <P>
            We&apos;re Sainto (Le Finds) — currently a web platform, soon an
            ecosystem.
          </P>
          <P>
            Right now, we help Gen Z in Mongolia find the niche pieces they see
            on TikTok, Instagram, or anywhere else on the internet — and
            actually get them.
          </P>
          <P>Because honestly… it shouldn&apos;t be that hard.</P>
        </motion.header>

        {/* WHY WE EXIST */}
        <Section title="Why we exist">
          <P>Finding clothes in Mongolia is weirdly difficult.</P>
          <ul className="space-y-2 mt-2 mb-4">
            <ListItem>You see something online → it disappears.</ListItem>
            <ListItem>
              You want to buy it locally → it&apos;s not here.
            </ListItem>
            <ListItem>
              You try ordering internationally → shipping, trust, sizing,
              headaches.
            </ListItem>
          </ul>
          <P>And if you want to sell your clothes? Good luck.</P>
          <P>So we built Sainto.</P>
          <P>
            A place where fashion you actually want to wear becomes findable,
            accessible, and eventually tradable — without the chaos.
          </P>
        </Section>

        {/* WHAT WE'RE BUILDING */}
        <Section title="What we're building">
          <P>
            We started as a simple platform that collects niche pieces from
            across the internet.
          </P>
          <P>But that&apos;s just phase one.</P>
          <P>Soon, Sainto becomes:</P>
          <ul className="space-y-2 mt-2 mb-4">
            <ListItem>
              Direct access to platforms like KREAM, StockX, GOAT
            </ListItem>
            <ListItem>
              A unified marketplace for global + local fashion
            </ListItem>
            <ListItem>
              A system where buying, selling, and discovering clothes actually
              feels modern
            </ListItem>
          </ul>
          <P>And eventually…</P>
          <P>
            Sainto becomes Central Asia&apos;s first Gen Z fashion ecosystem.
          </P>
          <P>Not a store. Not a marketplace.</P>
          <P>An infrastructure layer for fashion.</P>
        </Section>

        {/* WHY WE'RE DIFFERENT */}
        <Section title="Why we're different">
          <P>We&apos;re not trying to sell everything to everyone.</P>
          <P>We care about niche.</P>
          <P>If you know, you know.</P>
          <P>Sainto is:</P>
          <ul className="space-y-2 mt-2 mb-4">
            <ListItem>Built for Gen Z, not mass market shoppers</ListItem>
            <ListItem>
              Focused on culture-driven fashion, not just products
            </ListItem>
            <ListItem>Designed for discovery, not endless scrolling</ListItem>
            <ListItem>
              A little curated. A little selective. (Yes, we gatekeep.
              Slightly.)
            </ListItem>
          </ul>
          <P>We believe taste matters.</P>
        </Section>

        {/* WHAT WE'RE BECOMING */}
        <Section title="What we're becoming">
          <div className="space-y-6">
            <div>
              <p className="text-[15px] font-bold text-neutral-900 mb-1">
                Right now
              </p>
              <P>A web platform for finding niche fashion.</P>
            </div>
            <div>
              <p className="text-[15px] font-bold text-neutral-900 mb-1">
                Soon
              </p>
              <P>
                A full ecosystem for fashion commerce in Mongolia and beyond.
              </P>
            </div>
            <div>
              <p className="text-[15px] font-bold text-neutral-900 mb-1">
                Later
              </p>
              <P>
                A SaaS infrastructure for clothing brands — Shopify, but for
                fashion-native, culture-first stores with API access and
                control.
              </P>
            </div>
          </div>
          <P className="mt-6">We&apos;re not just building a marketplace.</P>
          <P>We&apos;re building the rails underneath it.</P>
        </Section>

        {/* WHO WE ARE */}
        <Section title="Who we are">
          <P>We&apos;re founders who code.</P>
          <P>
            We&apos;re not a corporate team, not a big company, not
            &quot;industry veterans.&quot;
          </P>
          <P>
            Just people who actually understand the problem because we live it.
          </P>
          <P>And we&apos;re building for people like us first.</P>
        </Section>

        {/* OUR PRINCIPLE */}
        <Section title="Our principle">
          <P>We&apos;re staying private for now.</P>
          <P>Not because we&apos;re secretive — because we&apos;re early.</P>
          <P>But we care about one thing:</P>
          <P>Building something that feels inevitable later.</P>
        </Section>

        {/* JOIN US / CTA - INJECTING THE "ISLAND" SPICE HERE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
          className="mt-24 pt-12 border-t border-neutral-200"
        >
          <h2 className="text-xl md:text-[22px] font-bold tracking-tight text-neutral-900 mb-4">
            Join us
          </h2>
          <P className="mb-8">
            If you&apos;re here early, you&apos;re early early. We&apos;re
            looking for people who understand taste, culture, systems, and chaos
            — and want to turn that into infrastructure. <br />
            <br />
            Or in simpler words: If you get it, you get it.
          </P>

          {/* 
            The Navbar Spice: 
            Applying the exact physical styling and shadow properties from the 
            Navbar's .island-surface to make the CTA feel like a premium, tactile object.
          */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ease: smoothEase, duration: 0.3 }}
            className="group relative flex h-12 w-fit items-center justify-between gap-3 rounded-full px-6 text-[15px] font-medium text-neutral-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 250, 1) 100%)",
              border: "1px solid",
              borderColor:
                "rgba(0, 0, 0, 0.05) rgba(0, 0, 0, 0.08) rgba(0, 0, 0, 0.12) rgba(0, 0, 0, 0.08)",
              boxShadow:
                "inset 0 1px 1px 0 rgba(255, 255, 255, 1), 0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 16px 40px -4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <span>Get in touch</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200">
              <ArrowUpRight
                className="h-3.5 w-3.5 text-neutral-600"
                strokeWidth={2.5}
              />
            </span>
          </motion.button>
        </motion.section>
      </article>
    </main>
  );
}
