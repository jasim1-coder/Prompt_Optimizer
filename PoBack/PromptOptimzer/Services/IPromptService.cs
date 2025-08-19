using PromptOptimzer.Dtos;
using PromptOptimzer.Models;

namespace PromptOptimzer.Services
{
    public interface IPromptService
    {
        Task<PromptResponse> OptimizeAndSaveAsync(string originalPrompt);
        Task<IEnumerable<PromptResponse>> GetAllAsync();
        Task<PromptResponse?> GetByIdAsync(int id);
    }
}
