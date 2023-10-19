using AutoMapper;
using recipes_app.DTOs;
using recipes_app.DTOs.Response;
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

            CreateMap<RegisterDto, AppUser>();

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
                dest => dest.LikeCount,
                opt => opt.MapFrom(src => src.Likes.Count)
            );

            CreateMap<RecipesDto, Recipes>();

            CreateMap<Photo, PhotoDto>();

            CreateMap<IngredientDto, Ingredient>();

            CreateMap<Likes, LikesDto>()
            .ForMember(
                dest => dest.UserName,
                opt => opt.MapFrom(src => src.AppUser.UserName)
            )
            .ForMember(
                dest => dest.UserPhotoUrl,
                opt => opt.MapFrom(src => src.AppUser.Photo.Url)
            );

            CreateMap<Comments, CommentDto>()
            .ForMember(
                dest => dest.UserName,
                opt => opt.MapFrom(src => src.AppUser.UserName)
            )
            .ForMember(
                dest => dest.UserPhotoUrl,
                opt => opt.MapFrom(src => src.AppUser.Photo.Url)
            );


        }
    }
}