namespace TodoApi.Data;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskModel> Tasks { get; set; }
}
