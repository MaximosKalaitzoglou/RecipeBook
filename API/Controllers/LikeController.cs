using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Extensions;
using recipes_app.Interfaces;

namespace recipes_app.Controllers
{
    public class LikeController : BaseApiController
    {
        private readonly ILikeRepository _likeRepository;

        public LikeController(ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
        }

        [HttpPost]
        public async Task<ActionResult<LikesDto>> LikeRecipe([FromBody] int recipeId)
        {
            var success = await _likeRepository.LikeRecipe(User.GetUsername(), recipeId);

            if (success.LikesDto != null)
            {
                return CreatedAtAction(nameof(LikeRecipe), new
                {
                    likeId = success.LikesDto.LikeId
                }, success.LikesDto);
            }
            else
            {
                return success.ErrorCode switch
                {
                    400 => BadRequest(success.ErrorMessage),
                    404 => NotFound(success.ErrorMessage),
                    _ => StatusCode(500, success.ErrorMessage),
                };
            }

        }

        [HttpDelete("{recipeId}")]
        public async Task<ActionResult> UnlikeRecipe(int recipeId)
        {

            var success = await _likeRepository.UnlikeRecipe(User.GetUsername(), recipeId);

            if (success.IsSuccess)
            {
                return Ok();
            }
            else
            {
                return success.ErrorCode switch
                {
                    400 => BadRequest(success.ErrorMessage),
                    404 => NotFound(success.ErrorMessage),
                    _ => StatusCode(500, success.ErrorMessage),
                };
            }

        }
    }
}