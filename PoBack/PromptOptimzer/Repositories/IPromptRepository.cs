using PromptOptimzer.Models;

namespace PromptOptimzer.Repositories
{
    public interface IPromptRepository
    {
        Task<IEnumerable<Prompt>> GetAllAsync();
        Task<Prompt> GetByIdAsync(int id);
        Task AddAsync(Prompt entity);
        Task SaveChangesAsync();
    }
}
