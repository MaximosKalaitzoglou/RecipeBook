using recipes_app.Models;

namespace recipes_app.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        //Extended --------------------------------------------------------->

        public string Interests { get; set; }

        public string Introduction { get; set; }

        public string Gender { get; set; }

        public string Country { get; set; }

        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        public DateOnly DateOfBirth { get; set; }

        public List<PhotoDto> Photos { get; set; } = new();

        public List<RecipesDto> Recipes { get; set; } = new();

    }
}