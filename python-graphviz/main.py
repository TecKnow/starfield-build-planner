"""Convert Starfield recipe data from YAML to graphviz

This provides a quick visual check of recipe data.
Unfortunately, graphviz graphs aren't meant to be traversed or otherwise
manipulated, so a different approach to producing the required materials
is required.
"""

import logging
import pprint

import graphviz
from yaml import load
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader

logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)


def load_data(filepath="./data/Recipes.yml"):
    """Load a YAML file with recipe data"""
    yaml_data = load(open(filepath, encoding="utf-8"), Loader=Loader)
    for recipe_names, recipe_info in yaml_data.items():
        if "materials" not in recipe_info:
            logger.warning("Found recipe %s without materials", recipe_names)
    return yaml_data


def get_height(recipe_name, crafting_data):
    """Calculate or return the height of a given recipe for layout purposes"""
    if recipe_name not in crafting_data:
        return 0
    crafting_data[recipe_name]["height"] = max(
        (get_height(ingredient, crafting_data)
         for ingredient
         in crafting_data[recipe_name]["materials"]))+1
    return crafting_data[recipe_name]["height"]


def add_heights(crafting_data):
    """Ensure that all recipes have height data"""
    all_recipes = crafting_data.keys()
    for current_recipe in all_recipes:
        get_height(current_recipe, crafting_data)
    return crafting_data


def group_ingredients_by_height(crafting_data):
    """return all ingredients grouped by height"""
    all_ingredients = {ingredient
                       for info in crafting_data.values()
                       for ingredient
                       in info["materials"]}.union(crafting_data.keys())
    height_dict = dict()
    for current_ingredient in all_ingredients:
        height = get_height(current_ingredient, crafting_data)
        height_dict.setdefault(height, set()).add(current_ingredient)
    return height_dict


if __name__ == "__main__":
    data = load_data()
    ingredients_by_height = group_ingredients_by_height(data)
    pprint.pprint(ingredients_by_height)
    materials_graph = graphviz.Digraph("Starfield Crafting", format="png")
    for rank, rank_recipes in ingredients_by_height.items():
        with materials_graph.subgraph(name=f"rank {rank}") as s:
            s.attr(rank="same")
            for i in rank_recipes:
                s.node(i)
    for recipe, info in data.items():
        for ingredient, amount in info["materials"].items():
            materials_graph.edge(recipe, ingredient, label=str(amount))
    materials_graph = materials_graph.unflatten(stagger=3)
    materials_graph.render()
