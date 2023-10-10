using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using recipes_app.Models;

namespace recipes_app.Data
{
    public class Seed
    {
        public static async Task SeedRecipes(DataContext context)
        {
            // if the database has data return
            if (await context.Recipes.AnyAsync()) return;

            var recipeData = await File.ReadAllTextAsync("Data/RecipeSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var recipes = JsonSerializer.Deserialize<List<Recipes>>(recipeData);
            if (recipes == null) return;
            foreach (var recipe in recipes)
            {
                context.Recipes.Add(recipe);

            }

            await context.SaveChangesAsync();

        }
    }
}