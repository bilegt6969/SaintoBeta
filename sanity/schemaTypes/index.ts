import { categoryPage } from "./categoryPage";
import { collection } from "./collection";
import { hero } from "./hero";
import { menu } from "./menu";
import { bestForItem } from "./objects/bestForItem";
import { keyIngredient } from "./objects/keyIngredient";
import { keyIngredientsSection } from "./objects/keyIngredientsSection";
import { productHighlight } from "./objects/productHighlight";
import { purchaseBundleOption } from "./objects/purchaseBundleOption";
import { page } from "./page";
import { product } from "./product";

export const schemaTypes = [
  productHighlight,
  purchaseBundleOption,
  bestForItem,
  keyIngredient,
  keyIngredientsSection,
  product,
  categoryPage,
  collection,
  page,
  menu,
  hero,
];
