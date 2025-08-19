namespace PromptOptimzer.Models
{
    public class Prompt
    {
        public int Id { get; set; }
        public string OriginalPrompt { get; set; }
        public string OptimizedPrompt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
