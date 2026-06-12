import { redirect } from "next/navigation";

/** Legacy `/search/:collection` URLs → category pages */
export default async function SearchCollectionRedirect(props: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await props.params;
  redirect(`/category/${collection}`);
}
