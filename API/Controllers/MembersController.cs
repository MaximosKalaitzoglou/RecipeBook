using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;

namespace recipes_app.Controllers
{
    [Authorize]
    public class MembersController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MembersController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<MemberDto>> GetMembers()
        {


            return Ok(await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync());

        }
    }
}