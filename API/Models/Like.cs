using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.Models
{
    public class Like
    {
        public int UserId { get; set; }
        public int RecipeId { get; set; }

        [Key]
        public int LikeId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public AppUser AppUser { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Recipes Recipes { get; set; }

    }
}