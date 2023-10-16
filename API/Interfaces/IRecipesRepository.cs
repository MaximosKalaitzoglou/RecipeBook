using System;
using Microsoft.AspNetCore.Mvc;
using recipes_app.Data.Repositories;
using recipes_app.DTOs;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface IRecipesRepository
    {
        void Update(Recipes recipe);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<RecipesDto>> GetRecipesAsync();

        Task<RecipesDto> GetRecipeByIdAsync(int id);

        Task<AddRecipeResult> AddRecipeAsync(RecipesDto recipesDto);

        Task<UpdateResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id);

        Task<bool> DeleteRecipe(int id);

    }
}