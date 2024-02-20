namespace TodoApi.Data;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<Task> Tasks { get; set; }
}
