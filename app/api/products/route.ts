import { getProducts } from "lib/commerce";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryHandle = searchParams.get("category");
  const sort = searchParams.get("sort");
  const reverse = searchParams.get("reverse") === "true";

  let sortKey: string | undefined;
  if (sort === "PRICE" || sort === "CREATED_AT") {
    sortKey = sort;
  }

  try {
    const products = await getProducts({
      categoryHandle: categoryHandle || undefined,
      sortKey,
      reverse,
    });

    // Serialize products to handle any non-serializable objects
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return NextResponse.json({ products: serializedProducts });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
