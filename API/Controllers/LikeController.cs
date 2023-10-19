using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Models;

namespace recipes_app.Controllers
{
    [Authorize]
    public class LikeController : BaseApiController
    {
        private readonly DataContext _context;
        public LikeController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<LikesDto>> LikeRecipe(LikesRequest likesRequest)
        {
            var user = await _context.Users.Include(u => u.Photo).SingleOrDefaultAsync(u => u.UserName == likesRequest.UserName);
            if (user == null) return NotFound("User not found");

            var recipe = await _context.Recipes.SingleOrDefaultAsync(r => r.Id == likesRequest.RecipeId);

            if (recipe == null) return NotFound("Recipe not found");

            var like = await _context.Likes.FirstOrDefaultAsync(l => l.UserId == user.Id & l.RecipeId == recipe.Id);

            if (like != null) return BadRequest("Like exists!! You can't like twice");

            var newLike = new Likes
            {
                UserId = user.Id,
                RecipeId = recipe.Id
            };
            await _context.Likes.AddAsync(newLike);
            if (await _context.SaveChangesAsync() > 0)
            {
                return new LikesDto
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    UserPhotoUrl = user.Photo?.Url,
                    LikeId = newLike.LikeId,
                };
            }


            {
                _context.Remove(like);
                if (await _context.SaveChangesAsync() > 0) return NoContent();

            }
            return BadRequest("Something went wrong with saving new Like");

        }

        [HttpDelete]
        public async Task<ActionResult> UnlikeRecipe(string username, int recipeId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (user == null) return NotFound("User not found");

            var recipe = await _context.Recipes.SingleOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null) return NotFound("Recipe not found");

            var like = await _context.Likes.FirstOrDefaultAsync(l => l.UserId == user.Id & l.RecipeId == recipe.Id);

            if (like == null) return BadRequest("This is not the Like you are Looking for!");

            _context.Likes.Remove(like);

            if (await _context.SaveChangesAsync() > 0)
            {
                return Ok();
            }

            return BadRequest("Something went wrong");


        }
    }
}