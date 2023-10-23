using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
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

            var userData = await File.ReadAllTextAsync("Data/RecipeSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;
            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();

                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password"));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);

            }

            await context.SaveChangesAsync();

        }
    }
}