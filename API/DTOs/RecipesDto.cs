using recipes_app.Models;

namespace recipes_app.DTOs
{
    public class RecipesDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public string PreparationSteps { get; set; } = null!;

        public string Category { get; set; } = null!;

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public List<IngredientDto> Ingredients { get; set; }
    }
}