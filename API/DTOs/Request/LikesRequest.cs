using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.DTOs.Request
{
    public class LikesRequest
    {
        public int RecipeId { get; set; }

        public string UserName { get; set; }
    }
}