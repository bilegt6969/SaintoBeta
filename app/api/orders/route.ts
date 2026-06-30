import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { formatOrderForApi } from "lib/auth/orders";
import dbConnect from "lib/dbConnect";
import { IOrder, Order } from "models/Order";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    await dbConnect();

    const orders = await Order.find({ userId: decodedToken.uid })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();

    return NextResponse.json(orders.map(formatOrderForApi));
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
