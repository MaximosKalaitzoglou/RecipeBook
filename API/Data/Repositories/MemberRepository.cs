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

        public async Task<bool> DeleteMemberAsync(string username)
        {
            var member = await _context.Users.SingleOrDefaultAsync(m => m.UserName == username);
            if (member == null)
            {
                return false;
            }

            _context.Users.Remove(member);
            return await SaveAllAsync();
        }

        public async Task<MemberDto> GetMemberByUserNameAsync(string username)
        {
            return await _context.Users.Where(x => x.UserName == username)
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync();

        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users
            .Include(u => u.Recipes)
            .Include(u => u.Photo)
            .SingleOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<IEnumerable<RecipesDto>> GetUserRecipesAsync(string username)
        {
            var user = await _context.Users
            .Include(u => u.Photo)
            .Include(u => u.Recipes)
            .ThenInclude(rec => rec.Likes)
            .SingleOrDefaultAsync(u => u.UserName == username);
            var userRecipes = _mapper.Map<IEnumerable<RecipesDto>>(user.Recipes);
            return userRecipes;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
            .Include(u => u.Recipes)
            .Include(u => u.Photo)
            .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<bool> UpdateMemberAsync(MemberDto memberDto)
        {
            var member = await _context.Users.FirstOrDefaultAsync(m => m.UserName == memberDto.UserName);

            if (member == null)
            {
                return false;
            }
            _mapper.Map(memberDto, member);

            return await SaveAllAsync();

        }
    }
}