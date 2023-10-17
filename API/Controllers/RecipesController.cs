using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using recipes_app.DTOs;
using recipes_app.Extensions;
using recipes_app.Interfaces;

namespace recipes_app.Controllers
{

    public class IsValidResponse
    {
        public bool Success { get; set; }
        public string Type { get; set; }
    }
    //TODO: Need to change other Http controllers to include AppUser Photo and username on the response
    public class RecipesController : BaseApiController
    {
        private readonly IRecipesRepository _recRepository;
        private readonly IMemberRepository _memberRep;


        public RecipesController(IRecipesRepository recRepository, IMemberRepository memberRep)
        {
            _recRepository = recRepository;
            _memberRep = memberRep;
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
            recipe.AppUserName = User.GetUsername();

            var response = await _recRepository.AddRecipeAsync(recipe);

            if (response == null) return NotFound("User not Found");
            else if (response.Success == false) return BadRequest("Something went wrong");
            return response.Recipe;
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id)
        {

            recipeUpdateDto.AppUserName = User.GetUsername();
            recipeUpdateDto.Id = id;

            var isValid = await ValidateAuthority(recipeUpdateDto.AppUserName, id);

            if (!isValid.Success)
            {
                if (isValid.Type == "not-found") return NotFound("User not Found");
                else return Unauthorized("You have no priviledges to edit this recipe");
            }

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

            var isValid = await ValidateAuthority(User.GetUsername(), id);

            if (!isValid.Success)
            {
                if (isValid.Type == "not-found") return NotFound("User not Found");
                else return Unauthorized("You have no priviledges to delete this recipe");
            }

            var result = await _recRepository.DeleteRecipe(id);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Something went wrong");
        }

        public async Task<IsValidResponse> ValidateAuthority(string username, int id)
        {
            var user = await _memberRep.GetUserByUserNameAsync(username);

            if (user == null)
            {
                return new IsValidResponse
                {
                    Success = false,
                    Type = "not-found"
                };
            }

            if (user.Recipes.DistinctBy(x => x.Id == id).Any() == false)
            {
                return new IsValidResponse
                {
                    Success = false,
                    Type = "not-authorized",
                };
            }

            return new IsValidResponse
            {
                Success = true,
                Type = ""
            };

        }

    }
}