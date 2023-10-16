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

        [Authorize]
        [HttpPost("save-recipe")]
        public async Task<ActionResult<RecipesDto>> AddRecipe(RecipesDto recipe)
        {
            var response = await _recRepository.AddRecipeAsync(recipe);

            if (response == null) return NotFound("User not Found");
            else if (response.Success == false) return BadRequest("Something went wrong");
            return response.Recipe;
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id)
        {
            var result = await _recRepository.UpdateRecipe(recipeUpdateDto, id);

            if (result.Success)
            {
                return NoContent();
            }
            else if (result.Error == "Not Found")
            {
                return NotFound("Recipe not found"); // or BadRequest("Something went wrong")
            }
            else
            {
                return BadRequest("Something went wrong");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecipe(int id)
        {
            var result = await _recRepository.DeleteRecipe(id);
            if (result)
            {
                return Ok("Succesfull");
            }
            return BadRequest("Something went wrong");
        }

    }
}