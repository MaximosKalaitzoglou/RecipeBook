using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using recipes_app.DTOs;
using recipes_app.DTOs.Request;
using recipes_app.Extensions;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {

        private readonly IMemberRepository _memberRep;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public MembersController(IMemberRepository memberRep, IMapper mapper, IPhotoService photoService)
        {
            _memberRep = memberRep;
            _photoService = photoService;
            _mapper = mapper;
        }

        [HttpGet("{username}/recipes")]
        public async Task<ActionResult<IEnumerable<RecipesDto>>> GetUserRecipes(string username)
        {
            return Ok(await _memberRep.GetUserRecipesAsync(username));
        }

        [HttpGet("list")]
        public async Task<ActionResult<MemberDto>> GetMembers()
        {
            return Ok(await _memberRep.GetMembersAsync());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetMemberByUserName(string username)
        {
            return Ok(await _memberRep.GetMemberByUserNameAsync(username));
        }

        [HttpGet("{username}/edit")]
        public async Task<ActionResult<MemberDto>> GetMemberByUserNameToEdit(string username)
        {
            var authUsername = User.GetUsername();

            if (authUsername != username)
            {
                return Unauthorized("You do not own this user profile in order to be ableedit it");
            }

            return Ok(await _memberRep.GetMemberByUserNameAsync(username));
        }

        [HttpPut("{username}")]
        public async Task<ActionResult> UpdateMemberByUsername(MemberUpdateRequest memberDto, string username)
        {
            var authUsername = User.GetUsername();
            if (authUsername != username) return Unauthorized("You are not authorized to update this members info");
            var result = await _memberRep.UpdateMemberAsync(memberDto, username);
            if (result == false)
            {
                return NotFound("user not found");
            }
            return NoContent();
        }

        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteMember(string username)
        {
            var result = await _memberRep.DeleteMemberAsync(username);
            if (result == false)
            {
                return NotFound("User not Found");
            }

            return Ok("Deleted succesfully");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhotoAsync(IFormFile file)
        {
            var user = await _memberRep.GetUserByUserNameAsync(User.GetUsername());
            if (user == null) return NotFound("User not found!");


            var result = await _photoService.AddPhotoAsync(file, "members");

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                IsMain = true
            };

            if (user.Photo != null)
            {
                if (user.Photo.PublicId.Length > 0)
                {

                    var deletionResult = await _photoService.DeletePhotoAsync(user.Photo.PublicId);
                    if (deletionResult.Error != null) return BadRequest("There was an error updating your Photo");
                }
            }
            user.Photo = photo;

            if (await _memberRep.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetMemberByUserName), new
                {
                    username = User.GetUsername()
                }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Something went wrong saving new User Photo");
        }



    }
}