using Microsoft.EntityFrameworkCore;
using recipes_app.Models;

namespace recipes_app.Data
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Recipes> Recipes { get; set; }
        public DbSet<Likes> Likes { get; set; }
        public DbSet<Comments> Comments { get; set; }


        public DbSet<AppUser> Users { get; set; }

    }
}