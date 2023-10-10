using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;
using recipes_app.Models;

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
                var newRec = new RecipesDto(recipe.Name, recipe.Description, recipe.ImageUrl, recipe.Ingredients);
                response.Add(newRec);
            }
            return Ok(response);
        }
    }
}