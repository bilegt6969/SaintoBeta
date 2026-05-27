import { collection } from "./collection";
import { bestForItem } from "./objects/bestForItem";
import { keyIngredient } from "./objects/keyIngredient";
import { keyIngredientsSection } from "./objects/keyIngredientsSection";
import { productHighlight } from "./objects/productHighlight";
import { purchaseBundleOption } from "./objects/purchaseBundleOption";
import { menu } from "./menu";
import { page } from "./page";
import { product } from "./product";

export const schemaTypes = [
  productHighlight,
  purchaseBundleOption,
  bestForItem,
  keyIngredient,
  keyIngredientsSection,
  product,
  collection,
  page,
  menu,
];
