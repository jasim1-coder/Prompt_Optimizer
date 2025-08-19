using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PromptOptimzer.Dtos;
using PromptOptimzer.Services;

namespace PromptOptimzer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptsController : ControllerBase
    {
        private readonly IPromptService _service;

        public PromptsController(IPromptService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("optimize")]
        public async Task<IActionResult> Optimize([FromBody] OptimizePromptRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.OriginalPrompt))
                return BadRequest("OriginalPrompt is required.");

            var result = await _service.OptimizeAndSaveAsync(req.OriginalPrompt);
            return Ok(result);
        }
    }
}
