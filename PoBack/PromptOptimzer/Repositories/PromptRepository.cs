using Microsoft.EntityFrameworkCore;
using PromptOptimzer.Data;
using PromptOptimzer.Models;

namespace PromptOptimzer.Repositories
{
 public class PromptRepository : IPromptRepository
    {
        private readonly AppDbContext _db;
        public PromptRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Prompt>> GetAllAsync() =>
            await _db.Prompts.AsNoTracking().OrderByDescending(p => p.Id).ToListAsync();

        public Task<Prompt?> GetByIdAsync(int id) => _db.Prompts.FindAsync(id).AsTask();

        public async Task AddAsync(Prompt entity) => await _db.Prompts.AddAsync(entity);

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}
