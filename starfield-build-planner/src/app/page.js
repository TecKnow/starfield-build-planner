import { readFileSync } from "node:fs";
import { cache } from "react";

import YAML from "yaml";

import "server-only";

import RecipeGraphContextProvider from "./RecipeGraphContextProvider";
import RecipeViz from "./RecipeViz";

export const getRecipeData = cache(async () => {
  const FileContents = await readFileSync("../data/Recipes.yml", "utf-8");
  const JSONRecipeData = YAML.parse(FileContents);
  return JSONRecipeData;
});

export default async function Home() {
  return (
    <main>
      <RecipeGraphContextProvider recipesData={await getRecipeData()}>
        <RecipeViz />
      </RecipeGraphContextProvider>
    </main>
  );
}
