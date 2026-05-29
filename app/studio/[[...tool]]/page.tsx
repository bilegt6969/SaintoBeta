"use client";

import dynamic from "next/dynamic";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const Studio = dynamic(
  () => import("./studio").then((mod) => mod.Studio),
  { ssr: false },
);

export default function StudioPage() {
  if (!projectId) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 480,
          margin: "4rem auto",
          padding: "0 1.5rem",
          lineHeight: 1.5,
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Sanity is not configured
        </h1>
        <p>
          Create a <code>.env.local</code> file (Next.js does not read{" "}
          <code>.env.example</code>) and set:
        </p>
        <pre
          style={{
            background: "#f4f4f5",
            padding: "1rem",
            borderRadius: 8,
            overflow: "auto",
            fontSize: "0.85rem",
          }}
        >
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`}
        </pre>
        <p>
          Get your project ID from{" "}
          <a href="https://www.sanity.io/manage">sanity.io/manage</a>, then
          restart <code>pnpm dev</code>.
        </p>
      </div>
    );
  }

  return <Studio />;
}
