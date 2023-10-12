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


        [HttpGet("list")]
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

        [HttpPost("save-recipe")]
        public async Task<ActionResult<Object>> AddRecipe(RecipesDto recipe)
        {
            var newRecipe = new Recipes
            {

            };
            _mapper.Map(recipe, newRecipe);
            await _context.Recipes.AddAsync(newRecipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipeById), new
            {
                Id = newRecipe.Id
            }, _mapper.Map<RecipesDto>(newRecipe));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id)
        {
            var recipe = await _context.Recipes.Include(rec => rec.Ingredients).FirstOrDefaultAsync(x => x.Id == id);
            if (recipe == null) return NotFound();

            _mapper.Map(recipeUpdateDto, recipe);

            if (await _context.SaveChangesAsync() > 0) return NoContent();

            return BadRequest("Something went wrong");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecipe(int id)
        {
            var recipe = new Recipes
            {
                Id = id
            };
            _context.Recipes.Remove(recipe);
            return Ok(await _context.SaveChangesAsync());
        }

    }
}