
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace recipes_app.Models
{
    [Table("Users")]
    public class AppUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        
        [Required]
        public string UserName { get; set; }


        //Extended --------------------------------------------------------->

        public string Interests { get; set; }

        public string Introduction { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string Country { get; set; }


        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        [Required]
        public DateOnly DateOfBirth { get; set; }

        public List<Photos> Photos { get; set; } = new();

        public List<Recipes> Recipes { get; set; } = new();

        //----------------------------------------------------------------->

        [Required]
        [MinLength(8)]
        public byte[] PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }


    }
}