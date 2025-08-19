namespace PromptOptimzer.Dtos
{
    public class PromptResponse
    {
        public int Id { get; set; }
        public string OriginalPrompt { get; set; } = string.Empty;
        public string OptimizedPrompt { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
