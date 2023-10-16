using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.DTOs
{
    public class MemberDto
    {
        public string UserName { get; set; }

        public string Alias { get; set; }

        public string Gender { get; set; }

        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        public DateOnly DateOfBirth { get; set; }

        public PhotoDto Photo { get; set; }

        public List<int> RecipeIds { get; set; } = new();
    }
}