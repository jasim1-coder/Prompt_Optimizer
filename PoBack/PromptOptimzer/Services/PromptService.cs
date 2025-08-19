using PromptOptimzer.Dtos;
using PromptOptimzer.Models;
using PromptOptimzer.Repositories;

namespace PromptOptimzer.Services
{
    public class PromptService : IPromptService
    {
        private readonly IPromptRepository _repo;
        private readonly IAIService _ai;

        public PromptService(IPromptRepository repo, IAIService ai)
        {
            _repo = repo;
            _ai = ai;
        }

        public async Task<PromptResponse> OptimizeAndSaveAsync(string originalPrompt)
        {
            var optimized = await _ai.OptimizeAsync(originalPrompt);

            var entity = new Prompt
            {
                OriginalPrompt = originalPrompt,
                OptimizedPrompt = optimized
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();

            return new PromptResponse
            {
                Id = entity.Id,
                OriginalPrompt = entity.OriginalPrompt,
                OptimizedPrompt = entity.OptimizedPrompt,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<IEnumerable<PromptResponse>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(p => new PromptResponse
            {
                Id = p.Id,
                OriginalPrompt = p.OriginalPrompt,
                OptimizedPrompt = p.OptimizedPrompt,
                CreatedAt = p.CreatedAt
            });
        }

        public async Task<PromptResponse?> GetByIdAsync(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p == null) return null;

            return new PromptResponse
            {
                Id = p.Id,
                OriginalPrompt = p.OriginalPrompt,
                OptimizedPrompt = p.OptimizedPrompt,
                CreatedAt = p.CreatedAt
            };
        }
    }
}
