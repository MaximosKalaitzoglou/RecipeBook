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

        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetMemberById(int id)
        {
            return Ok(await _memberRep.GetMemberByIdAsync(id));
        }
    }
}