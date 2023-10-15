using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        Task<Recipes> AddRecipe(RecipesDto recipesDto);


    }
}