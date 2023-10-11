using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;

namespace recipes_app.Controllers
{
    public class RecipesController : BaseApiController
    {
        private readonly DataContext _context;
        public RecipesController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipesDto>>> GetRecipes()
        {
            var response = new List<RecipesDto>();
            var recipes = await _context.Recipes.Include(rec => rec.Ingredients).ToListAsync();
            foreach (var recipe in recipes)
            {
                var newRec = new RecipesDto(recipe.Id, recipe.Name, recipe.Description, recipe.ImageUrl, recipe.Ingredients);
                response.Add(newRec);
            }
            return response;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipesDto>> GetRecipeById(int id)
        {
            var recipe = await _context.Recipes.Include(rec => rec.Ingredients).FirstOrDefaultAsync(x => x.Id == id);
            return new RecipesDto(recipe.Id, recipe.Name, recipe.Description, recipe.ImageUrl, recipe.Ingredients);
        }
    }
}