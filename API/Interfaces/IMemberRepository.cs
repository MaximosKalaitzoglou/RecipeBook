using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface IMemberRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<RecipesDto>> GetUserRecipesAsync(string username);

        Task<IEnumerable<AppUser>> GetUsersAsync();


        Task<AppUser> GetUserByUserNameAsync(string username);

        Task<IEnumerable<MemberDto>> GetMembersAsync();

        Task<MemberDto> GetMemberByUserNameAsync(string username);

        Task<bool> UpdateMemberAsync(MemberDto memberDto);

        Task<bool> DeleteMemberAsync(string username);
    }
}