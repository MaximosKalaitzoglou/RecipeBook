using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.Models;

namespace recipes_app.DTOs
{
    public class RecipesDto
    {
        public RecipesDto(string name, string desc, string imagePath, List<Ingredient> ing)
        {
            Name = name;
            Description = desc;
            ImagePath = imagePath;
            Ingredients = ing;
        }
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string ImagePath { get; set; } = null!;

        public List<Ingredient> Ingredients { get; set; }
    }
}