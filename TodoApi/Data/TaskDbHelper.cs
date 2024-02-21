namespace TodoApi.Data;
using TodoApi.Models;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

internal static class TaskDbHelper
{
    internal static void Initialize(IServiceProvider serviceProvider)
    {

        using (var context = new TaskDbContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<TaskDbContext>>()))
        {
            if (context.Tasks.Any())
            {
                return;
            }
            context.Tasks.AddRange(
                new TaskModel
                {
                    Name = "Task 1",
                    IsComplete = false,
                    CreationTime = DateTime.Now
                },
                new TaskModel
                {
                    Name = "Task 2",
                    IsComplete = true,
                    CreationTime = DateTime.Now
                },
                new TaskModel
                {
                    Name = "Task 3",
                    IsComplete = false,
                    CreationTime = DateTime.Now
                },
                new TaskModel
                {
                    Name = "Task 4",
                    IsComplete = true,
                    CreationTime = DateTime.Now
                }
            );
            context.SaveChanges();
        }
            

        
    }
}