using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using recipes_app.Data.Repositories;
using recipes_app.Helpers;
using recipes_app.Interfaces;
using recipes_app.Services;
using recipes_app.SignalR;

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

            services.AddScoped<IRecipesRepository, RecipesRepository>();

            services.AddScoped<IMemberRepository, MemberRepository>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<IPhotoService, PhotoService>();

            services.AddScoped<RecipeOwnershipActionFilter>();

            services.AddScoped<AccountOwnershipActionFilter>();

            services.AddScoped<ILikeRepository, LikeRepository>();

            services.AddScoped<IMessageRepository, MessageRepository>();

            services.AddSignalR();

            services.AddSingleton<PresenceTracker>();

            return services;
        }
    }
}