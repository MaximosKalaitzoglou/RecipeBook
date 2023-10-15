using System.ComponentModel.DataAnnotations;

namespace recipes_app.DTOs
{
    public class RecipesDto
    {

        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public string ImageUrl { get; set; } = null!;

        [Required]
        public string PreparationSteps { get; set; } = null!;

        [Required]
        public string Category { get; set; } = null!;

        [Required]
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        [Required]
        public List<IngredientDto> Ingredients { get; set; }

        [Required]
        public int AppUserId { get; set; }
    }
}