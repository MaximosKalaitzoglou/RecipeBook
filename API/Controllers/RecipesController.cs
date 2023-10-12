using AutoMapper;
using AutoMapper.QueryableExtensions;
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
        private readonly IMapper _mapper;

        public RecipesController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipesDto>>> GetRecipes()
        {
            var recipes = await _context.Recipes.Include(rec => rec.Ingredients).ToListAsync();

            var recipesToReturn = _mapper.Map<IEnumerable<RecipesDto>>(recipes);

            return Ok(recipesToReturn);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipesDto>> GetRecipeById(int id)
        {
            var recipe = await _context.Recipes.ProjectTo<RecipesDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == id);
            return recipe;
        }

        [HttpPost]
        public async Task<ActionResult> AddRecipe(Recipes recipe)
        {
            var newRecipe = new Recipes
            {
                Name = recipe.Name,
                Description = recipe.Description,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.Ingredients
            };
            await _context.Recipes.AddAsync(newRecipe);
            return Ok(await _context.SaveChangesAsync());
        }
    }
}