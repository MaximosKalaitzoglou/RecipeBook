using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using recipes_app.DTOs;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Data.Repositories
{


    public class RecipesRepository : IRecipesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public RecipesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Recipes> AddRecipe(RecipesDto recipesDto)
        {
            var newRecipe = new Recipes
            {
            };
            _mapper.Map(recipesDto, newRecipe);
            await _context.Recipes.AddAsync(newRecipe);
            return newRecipe;

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