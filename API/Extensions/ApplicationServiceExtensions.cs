using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using recipes_app.Interfaces;
using recipes_app.Services;

namespace recipes_app.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddAplicationServices(this IServiceCollection services,
         IConfiguration config)
        {
            services.AddDbContext<Data.DataContext>(options =>
            {
                var connectionString = config.GetConnectionString("DefaultConnection");
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddCors();

            services.AddScoped<ITokenService, TokenService>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


            return services;
        }
    }
}