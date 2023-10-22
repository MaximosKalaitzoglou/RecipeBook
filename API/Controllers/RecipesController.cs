using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;
using recipes_app.DTOs.Request;
using recipes_app.Extensions;
using recipes_app.Helpers;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Controllers
{

    public class IsValidResponse
    {
        public bool Success { get; set; }
        public string Type { get; set; }
    }
    [Authorize]
    public class RecipesController : BaseApiController
    {
        private readonly IRecipesRepository _recRepository;
        private readonly IMemberRepository _memberRep;

        private readonly IPhotoService _photoService;

        private readonly IMapper _mapper;

        private readonly DataContext _context;

        public RecipesController(IRecipesRepository recRepository, IMemberRepository memberRep, IMapper mapper, IPhotoService photoService, DataContext context)
        {
            _recRepository = recRepository;
            _memberRep = memberRep;
            _photoService = photoService;
            _mapper = mapper;
            _context = context;
        }


        [HttpGet("list")]
        public async Task<ActionResult<PaginationFilter<RecipesDto>>> GetRecipes([FromQuery] UserParams userParams)
        {
            var recipes = await _recRepository.GetRecipesAsync(userParams);

            if (!recipes.Any()) return NotFound("No found Recipes");
            var authUser = User.GetUsername();
            if (authUser == null) return Unauthorized("Uknown user");

            foreach (var recipe in recipes)
            {
                // Check if the authenticated user has liked this recipe
                var hasLiked = await _recRepository.UserHasLikedRecipe(authUser, recipe.Id);
                recipe.HasLiked = hasLiked;
            }

            Response
            .AddPaginationHeader(
                new PaginationHeader(recipes.Offset,
                 recipes.PageSize, recipes.TotalCount, recipes.TotalPages));

            return Ok(recipes);
        }

        //View Page recipes
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipesDto>> GetRecipeById(int id)
        {
            var userName = User.GetUsername();
            var user = await _memberRep.GetUserByUserNameAsync(userName);

            var result = await _recRepository.GetRecipeByIdAsync(id);

            if (result == null) return NotFound("Recipe doesn't exist");

            return Ok(result);
        }

        // Edit page Recipes
        [HttpGet("{id}/edit")]
        public async Task<ActionResult<RecipesDto>> GetRecipeByIdToEdit(int id)
        {
            var userName = User.GetUsername();
            var user = await _memberRep.GetUserByUserNameAsync(userName);

            var result = await _recRepository.GetRecipeByIdAsync(id);

            if (result == null) return NotFound("Recipe doesn't exist");

            if (!result.AppUserName.Equals(user.UserName)) return Unauthorized("You are not allowed to edit this recipe");
            return Ok(result);
        }

        [HttpPost("save-recipe")]
        public async Task<ActionResult<RecipesDto>> AddRecipe(RecipeRequest recipe)
        {
            var authUser = User.GetUsername();
            var response = await _recRepository.AddRecipeAsync(recipe, authUser);

            if (response == null) return NotFound("User not Found");
            else if (response.Success == false) return BadRequest("Something went wrong");
            return response.Recipe;
        }


        [HttpPost("{id}/add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhotoAsync(IFormFile file, int id)
        {
            var user = await _memberRep.GetUserByUserNameAsync(User.GetUsername());
            if (user == null) return NotFound("User not found!");

            var recipe = await _context.Recipes.FirstOrDefaultAsync(rec => rec.Id == id);
            if (recipe == null) return NotFound("Recipe not found");

            var result = await _photoService.AddPhotoAsync(file, "recipes");

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true
            };

            if (recipe.Photo != null)
            {
                if (recipe.Photo.PublicId.Length > 0)
                {

                    var deletionResult = await _photoService.DeletePhotoAsync(recipe.Photo.PublicId);
                    if (deletionResult.Error != null) return BadRequest("There was an error updating your Photo");
                }
            }
            recipe.Photo = photo;

            if (await _memberRep.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetRecipeById), new
                {
                    id = recipe.Id
                }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Something went wrong saving new User Photo");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRecipe(RecipeRequest recipeUpdateDto, int id)
        {

            var username = User.GetUsername();
            // recipeUpdateDto.Id = id;

            var isValid = await ValidateAuthority(username, id);

            if (!isValid.Success)
            {
                if (isValid.Type == "not-found") return NotFound("User not Found");
                else return Unauthorized("You have no priviledges to edit this recipe");
            }
            // recipeUpdateDto.AppUserName = User.GetUsername();


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

            if (user.Recipes.FirstOrDefault(x => x.Id == id) == null)
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