import { bundleAffinityCache } from "lib/recommendations/cache";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify the webhook signature (Sanity provides a secret)
  const secret = request.headers.get("sanity-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const affectedProductId = body._id;

    if (affectedProductId) {
      // Invalidate this product's recommendations AND any product that had it
      // as a recommendation (nearby products)
      revalidateTag("recommendations", {});
      revalidateTag(`recommendations-${affectedProductId}`, {});

      // Invalidate bundle affinity cache so it rebuilds on next request
      bundleAffinityCache.invalidate("bundle-affinity");
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
