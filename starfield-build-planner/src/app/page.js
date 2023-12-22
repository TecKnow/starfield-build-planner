import { readFileSync } from "node:fs";
import { cache } from "react";

import YAML from "yaml";

import "server-only";
import RecipeGraph from "./RecipeGraph";

export const getRecipeData = cache(async () => {
  const FileContents = await readFileSync("../data/Recipes.yml", "utf-8");
  const JSONRecipeData = YAML.parse(FileContents);
  return JSONRecipeData;
});

export default async function Home() {
  return (
    <main>
      <RecipeGraph recipesData={await getRecipeData()} />
    </main>
  );
}
