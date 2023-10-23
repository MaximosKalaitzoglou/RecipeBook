using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.Data.Repositories;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface ILikeRepository
    {
        Task<LikeResult> LikeRecipe(string username, int recipeId);
        Task<LikeResult> UnlikeRecipe(string username, int recipeId);

        Task<bool> SaveAllAsync();
    }
}