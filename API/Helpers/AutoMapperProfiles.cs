using AutoMapper;
using recipes_app.DTOs;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Models;

namespace recipes_app.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Ingredient, IngredientDto>();
            CreateMap<AppUser, MemberDto>();
            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberDto, AppUser>();

            CreateMap<MemberUpdateRequest, AppUser>();

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
            ).ForMember(
                dest => dest.ImageUrl,
                opt => opt.MapFrom(src => src.Photo.Url)
            );

            CreateMap<Message, MessageDto>()
                    .ForMember(
                        dest => dest.SenderPhotoUrl,
                        opt => opt.MapFrom(src => src.Sender.Photo.Url)
                    ).ForMember(
                        dest => dest.ReceiverPhotoUrl,
                        opt => opt.MapFrom(src => src.Receiver.Photo.Url)
                    ).ForMember(
                        dest => dest.SenderPhotoUrl,
                        opt => opt.MapFrom(src => src.Sender.Photo.Url)
                    );


            CreateMap<RecipeRequest, Recipes>();


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

            CreateMap<DateTime, DateTime>()
                .ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(d =>
                 d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc)
                            : null);
        }
    }
}