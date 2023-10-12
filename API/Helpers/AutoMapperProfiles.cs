using AutoMapper;
using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Recipes, RecipesDto>();
            CreateMap<Ingredient, IngredientDto>();
        }
    }
}