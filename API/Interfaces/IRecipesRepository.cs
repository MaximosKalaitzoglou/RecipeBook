using System;
using Microsoft.AspNetCore.Mvc;
using recipes_app.Data.Repositories;
using recipes_app.DTOs;
using recipes_app.DTOs.Request;
using recipes_app.Helpers;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface IRecipesRepository
    {
        void Update(Recipes recipe);

        Task<bool> UserHasLikedRecipe(string username, int recipeId);
        Task<bool> SaveAllAsync();

        Task<PaginationFilter<RecipesDto>> GetRecipesAsync(UserParams userParams);

        Task<RecipesDto> GetRecipeByIdAsync(int id);

        Task<Recipes> GetContextRecipeByIdAsync(int id);
        Task<AddRecipeResult> AddRecipeAsync(RecipeRequest recipesDto, string username);

        Task<UpdateResult> UpdateRecipe(RecipeRequest recipeUpdateDto, int id);

        Task<bool> DeleteRecipe(int id);


    }
}