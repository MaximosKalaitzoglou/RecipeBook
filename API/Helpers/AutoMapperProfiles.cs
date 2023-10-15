using AutoMapper;
using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // CreateMap<Recipes, RecipesDto>();
            CreateMap<Ingredient, IngredientDto>();
            CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.RecipeIds, opt => opt.MapFrom(src => src.Recipes.Select(r => r.Id)))
            .ReverseMap();

            CreateMap<Recipes, RecipesDto>()
            .ForMember(
                dest => dest.AppUserPhotoUrl,
                opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url)
            )
            .ForMember(
                dest => dest.AppUserName,
                opt => opt.MapFrom(src => src.AppUser.UserName)
            );

            CreateMap<Photos, PhotoDto>();

            CreateMap<RecipesDto, Recipes>();
            CreateMap<IngredientDto, Ingredient>();
        }
    }
}