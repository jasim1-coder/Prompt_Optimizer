using System.Text.Json;
using System.Text.Json.Serialization;

namespace PromptOptimzer.Services
{
    /// <summary>
    /// Minimal client that calls OpenAI's Chat Completions API to rewrite/optimize a prompt.
    /// Reads OPENAI_API_KEY from environment or configuration.
    /// </summary>
    public class OpenAIService : IAIService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _endpoint;
        private readonly string _model;

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        public OpenAIService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _apiKey = config["OpenAI:ApiKey"] ?? System.Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "";
            _endpoint = config["OpenAI:Endpoint"] ?? "https://api.openai.com/v1/chat/completions";
            _model = config["OpenAI:Model"] ?? "gpt-4o-mini";

            if (!_http.DefaultRequestHeaders.Contains("Authorization") && !string.IsNullOrEmpty(_apiKey))
                _http.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> OptimizeAsync(string originalPrompt)
        {
            // Simple system guidance that improves clarity/specificity without changing intent.
            var payload = new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = "You are a prompt optimization assistant. Rewrite the user's prompt to be clear, specific, and constrained, preserving intent. Do not answer the prompt, only rewrite it." },
                    new { role = "user", content = originalPrompt }
                },
                temperature = 0.3
            };


            using var resp = await _http.PostAsJsonAsync(_endpoint, payload, JsonOpts);

            if (!resp.IsSuccessStatusCode)
            {
                var problem = await resp.Content.ReadAsStringAsync();
                // Fallback to a basic rewrite if API is unavailable
                return $"[fallback] Improve and clarify: {originalPrompt}\n\n(API error: {resp.StatusCode} - {problem})";
            }

            using var stream = await resp.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return content ?? originalPrompt;
        }
    }
}
