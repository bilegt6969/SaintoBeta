import { getProducts } from "lib/commerce";
import { defaultSort, sorting } from "lib/constants";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort");
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  if (!q) {
    return NextResponse.json({ products: [], query: "" });
  }

  const products = await getProducts({ sortKey, reverse, query: q });

  return NextResponse.json({ products, query: q });
}
