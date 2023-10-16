
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

        public string Alias { get; set; }

        public string Gender { get; set; }

        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        public DateOnly DateOfBirth { get; set; }

        public Photo Photo { get; set; }

        public List<Recipes> Recipes { get; set; } = new();


        [Required]
        [MinLength(8)]
        public byte[] PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }


    }
}