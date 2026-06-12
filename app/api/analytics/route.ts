import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Log the metric for development
    console.log("Web Vitals metric:", metric);

    // Here you can send the metric to your analytics service
    // Examples:
    // - Send to Vercel Analytics
    // - Send to Google Analytics
    // - Send to a custom database
    // - Send to services like Plausible, Mixpanel, etc.

    // Example: Send to a custom endpoint
    // await fetch("https://your-analytics-service.com/api/metrics", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(metric),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing analytics:", error);
    return NextResponse.json(
      { error: "Failed to process analytics" },
      { status: 500 }
    );
  }
}
