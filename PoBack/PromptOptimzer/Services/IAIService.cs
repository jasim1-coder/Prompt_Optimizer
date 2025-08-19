namespace PromptOptimzer.Services
{
    public interface IAIService
    {
        Task<string> OptimizeAsync(string originalPrompt);
    }
}
