using Microsoft.EntityFrameworkCore;
using PromptOptimzer.Models;
using System.Collections.Generic;

namespace PromptOptimzer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Prompt> Prompts => Set<Prompt>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Prompt>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.OriginalPrompt).IsRequired().HasMaxLength(4000);
                e.Property(p => p.OptimizedPrompt).IsRequired().HasMaxLength(8000);
                e.Property(p => p.CreatedAt).IsRequired();
            });
        }
    }
}
