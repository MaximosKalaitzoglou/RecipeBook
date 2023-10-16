using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using recipes_app.DTOs;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Data.Repositories
{

    public class UpdateResult
    {
        public bool Success { get; set; }
        public string Error { get; set; }
    }

    public class AddRecipeResult
    {
        public RecipesDto Recipe { get; set; }
        public bool Success { get; set; }
    }


    public class RecipesRepository : IRecipesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public RecipesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Task<RecipesDto> GetRecipeByIdAsync(int id)
        {
            return _context.Recipes.Where(rec => rec.Id == id)
                .Include(rec => rec.Ingredients)
                .Include(rec => rec.AppUser)
                .ThenInclude(u => u.Photos)
                .ProjectTo<RecipesDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<RecipesDto>> GetRecipesAsync()
        {
            return await _context.Recipes
                    .Include(rec => rec.Ingredients)
                    .Include(rec => rec.AppUser)
                    .ThenInclude(u => u.Photos)
                    .ProjectTo<RecipesDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();
        }

        public async Task<AddRecipeResult> AddRecipeAsync(RecipesDto recipesDto)
        {
            var user = _context.Users.SingleOrDefault(user => user.UserName == recipesDto.AppUserName);

            if (user == null)
            {
                return null;
            }
            var newRecipe = _mapper.Map<Recipes>(recipesDto);
            newRecipe.AppUserId = user.Id;

            await _context.Recipes.AddAsync(newRecipe);
            if (await SaveAllAsync())
            {
                return new AddRecipeResult { Recipe = _mapper.Map<RecipesDto>(newRecipe), Success = true };

            }

            return new AddRecipeResult
            {
                Recipe = null,
                Success = false
            };

        }


        public async Task<UpdateResult> UpdateRecipe(RecipesDto recipeUpdateDto, int id)
        {
            var recipe = await _context.Recipes.Include(rec => rec.Ingredients).FirstOrDefaultAsync(x => x.Id == id);
            if (recipe == null)
            {
                return new UpdateResult
                {
                    Success = false,
                    Error = "Not Found"
                };
            }

            _mapper.Map(recipeUpdateDto, recipe);

            if (await SaveAllAsync())
            {
                return new UpdateResult
                {
                    Success = true,
                    Error = ""
                };
            }
            else
            {
                return new UpdateResult
                {
                    Success = false,
                    Error = "Bad Request"
                };
            }

        }


        public async Task<bool> DeleteRecipe(int id){
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null){
                return false;
            }
            _context.Recipes.Remove(recipe);
            
            return await SaveAllAsync();
        }
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(Recipes recipe)
        {
            _context.Entry(recipe).State = EntityState.Modified;
        }



    }
}