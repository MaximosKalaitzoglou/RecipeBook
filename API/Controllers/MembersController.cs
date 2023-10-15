using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.Data;
using recipes_app.DTOs;

namespace recipes_app.Controllers
{
    public class MembersController : BaseApiController
    {

        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MembersController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("list")]
        public async Task<ActionResult<MemberDto>> GetMembers()
        {
            return Ok(await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetMemberById(int id)
        {
            return await _context.Users
                        .Where(x => x.Id == id)
                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                        .SingleOrDefaultAsync();
        }
    }
}