using AutoMapper;
using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Ingredient, IngredientDto>();
            CreateMap<AppUser, MemberDto>()
            .ReverseMap();

            CreateMap<Recipes, RecipesDto>()
            .ForMember(
                dest => dest.AppUserPhotoUrl,
                opt => opt.MapFrom(src => src.AppUser.Photo.Url)
            )
            .ForMember(
                dest => dest.AppUserName,
                opt => opt.MapFrom(src => src.AppUser.UserName)
            )
            .ForMember(
                dest => dest.AppUserId,
                opt => opt.MapFrom(src => src.AppUser.Id)
            );

            CreateMap<RecipesDto, Recipes>();

            CreateMap<Photo, PhotoDto>();

            CreateMap<IngredientDto, Ingredient>();
        }
    }
}