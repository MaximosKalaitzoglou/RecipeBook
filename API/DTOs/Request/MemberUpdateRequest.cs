using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.DTOs.Request
{
    public class MemberUpdateRequest
    {
        public string Alias { get; set; }

        public string Gender { get; set; }

        public string Description { get; set; }
    }
}