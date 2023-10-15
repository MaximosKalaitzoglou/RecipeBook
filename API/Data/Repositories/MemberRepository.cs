using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using recipes_app.DTOs;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Data.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MemberRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<MemberDto> GetMemberByIdAsync(int id)
        {
            return await _context.Users.Where(x => x.Id == id)
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync();

        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}