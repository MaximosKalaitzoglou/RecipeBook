using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;
using recipes_app.Interfaces;

namespace recipes_app.Controllers
{
    public class MembersController : BaseApiController
    {

        private readonly IMemberRepository _memberRep;


        public MembersController(IMemberRepository memberRep)
        {
            _memberRep = memberRep;
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

        [HttpPut("{username}")]
        public async Task<ActionResult> UpdateMemberById(MemberDto memberDto, string username)
        {
            var result = await _memberRep.UpdateMemberAsync(memberDto);
            if (result == false){
                return NotFound("user not found");
            }
            return NoContent();
        }

        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteMember(string username){
            var result = await _memberRep.DeleteMemberAsync(username);
            if (result == false){
                return NotFound("User not Found");
            }

            return Ok("Deleted succesfully");
        }
    }
}