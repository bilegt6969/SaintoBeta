import { ProductView } from "models/ProductView";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// Cache the connection
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = await mongoose.connect(MONGODB_URI!);
  return cachedConnection;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productHandle } = body;

    if (!productId || !productHandle) {
      return NextResponse.json(
        { error: "productId and productHandle are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Use findOneAndUpdate with upsert to either increment existing or create new
    const result = await ProductView.findOneAndUpdate(
      { productId },
      {
        $inc: { viewCount: 1 },
        $set: {
          productHandle,
          lastViewedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      viewCount: result?.viewCount || 1,
      productId,
    });
  } catch (error) {
    console.error("Failed to track product view:", error);
    return NextResponse.json(
      { error: "Failed to track product view" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const productView = await ProductView.findOne({ productId });

    return NextResponse.json({
      viewCount: productView?.viewCount || 0,
      lastViewedAt: productView?.lastViewedAt || null,
    });
  } catch (error) {
    console.error("Failed to get product view count:", error);
    return NextResponse.json(
      { error: "Failed to get product view count" },
      { status: 500 },
    );
  }
}
