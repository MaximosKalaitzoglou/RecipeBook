using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Controllers
{
    //TODO: Need to change other Http controllers to include AppUser Photo and username on the response
    public class RecipesController : BaseApiController
    {
        // private readonly DataContext _context;
        // private readonly IMapper _mapper;
        private readonly IRecipesRepository _recRepository;

        public RecipesController(IRecipesRepository recRepository)
        {
            _recRepository = recRepository;
        }


        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<RecipesDto>>> GetRecipes()
        {
            return Ok(await _recRepository.GetRecipesAsync());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipesDto>> GetRecipeById(int id)
        {
            return Ok(await _recRepository.GetRecipeByIdAsync(id));
        }

        // [Authorize]
        // [HttpPost("save-recipe")]
        // public async Task<ActionResult<Object>> AddRecipe(RecipesDto recipe)
        // {
        //     var newRecipe = new Recipes
        //     {

        //     };
        //     _mapper.Map(recipe, newRecipe);
        //     await _context.Recipes.AddAsync(newRecipe);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetRecipeById), new
        //     {
        //         Id = newRecipe.Id
        //     }, newRecipe);
        // }
        // [Authorize]
        // [HttpPut("{id}")]
        // public async Task<ActionResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id)
        // {
        //     var recipe = await _context.Recipes.Include(rec => rec.Ingredients).FirstOrDefaultAsync(x => x.Id == id);
        //     if (recipe == null) return NotFound();

        //     _mapper.Map(recipeUpdateDto, recipe);

        //     if (await _context.SaveChangesAsync() > 0) return NoContent();

        //     return BadRequest("Something went wrong");
        // }

        // [Authorize]
        // [HttpDelete("{id}")]
        // public async Task<ActionResult> DeleteRecipe(int id)
        // {
        //     var recipe = new Recipes
        //     {
        //         Id = id
        //     };
        //     _context.Recipes.Remove(recipe);
        //     return Ok(await _context.SaveChangesAsync());
        // }

    }
}