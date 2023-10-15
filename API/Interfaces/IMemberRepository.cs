using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface IMemberRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<MemberDto>> GetMembersAsync();

        Task<MemberDto> GetMemberByIdAsync(int id);

    }
}