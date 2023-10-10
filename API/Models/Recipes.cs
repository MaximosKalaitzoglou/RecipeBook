
namespace recipes_app.Models
{

    public class Recipes
    {
        public int Id { get; set; }


        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public List<Ingredient> Ingredients { get; set; } = new();

    }
}