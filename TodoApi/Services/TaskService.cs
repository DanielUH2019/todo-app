

using Microsoft.AspNetCore.OData.Deltas;
using TodoApi.Models;
using TodoApi.Data;
using Microsoft.EntityFrameworkCore;
namespace TodoApi.Services;

public interface ITaskService
{
    IQueryable<TaskModel> GetTasks();
    Task<TaskModel?> GetTaskByIdAsync(int id);
    Task<TaskModel> AddTaskAsync(TaskModel task);
    Task<TaskModel?> UpdateTaskAsync(int id, TaskModel task);
    Task<TaskModel?> PatchTaskAsync(int id, Delta<TaskModel> delta);
    Task<TaskModel?> DeleteTaskAsync(int id);
}

public class TaskService : ITaskService
{
    private readonly TaskDbContext db;

    public TaskService(TaskDbContext db)
    {
        this.db = db;
    }

    public IQueryable<TaskModel> GetTasks()
    {
        return db.Tasks.AsQueryable();
    }

    public async Task<TaskModel?> GetTaskByIdAsync(int id)
    {
        return await db.Tasks.SingleOrDefaultAsync(d => d.Id == id);
    }

    public async Task<TaskModel> AddTaskAsync(TaskModel task)
    {
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return task;
    }

    public async Task<TaskModel?> UpdateTaskAsync(int id, TaskModel task)
    {
        var taskToUpdate = await db.Tasks.SingleOrDefaultAsync(d => d.Id == id);
        if (taskToUpdate == null)
        {
            return null;
        }
        taskToUpdate.Name = task.Name;
        taskToUpdate.IsComplete = task.IsComplete;
        taskToUpdate.CompletedAt = task.CompletedAt;
        await db.SaveChangesAsync();
        return taskToUpdate;
    }

    public async Task<TaskModel?> PatchTaskAsync(int id, Delta<TaskModel> delta)
    {
        var taskToUpdate = await db.Tasks.SingleOrDefaultAsync(d => d.Id == id);
        if (taskToUpdate == null)
        {
            return null;
        }
        delta.Patch(taskToUpdate);
        await db.SaveChangesAsync();
        return taskToUpdate;
    }

    public async Task<TaskModel?> DeleteTaskAsync(int id)
    {
        var taskToDelete = await db.Tasks.SingleOrDefaultAsync(d => d.Id == id);
        if (taskToDelete == null)
        {
            return null;
        }
        db.Tasks.Remove(taskToDelete);
        await db.SaveChangesAsync();
        return taskToDelete;
    }
}