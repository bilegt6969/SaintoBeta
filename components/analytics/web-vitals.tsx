"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log metrics to console for development
    console.log(metric);

    // Send to your analytics endpoint
    // Example: Send to Vercel Analytics, Google Analytics, or custom endpoint
    const body = JSON.stringify(metric);
    const url = "/api/analytics";

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: "POST", keepalive: true });
    }

    // If you use Google Analytics, you can send metrics like this:
    // if (window.gtag) {
    //   window.gtag("event", metric.name, {
    //     value: Math.round(
    //       metric.name === "CLS" ? metric.value * 1000 : metric.value
    //     ),
    //     event_label: metric.id,
    //     non_interaction: true,
    //   });
    // }
  });

  return null;
}
