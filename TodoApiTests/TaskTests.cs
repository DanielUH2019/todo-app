using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TodoApi.Models;
using TodoApi.Data;
using TodoApi.Controllers;
using TodoApi.Services;
using Moq;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Results;

using Microsoft.AspNetCore.OData.Deltas;
using Moq.EntityFrameworkCore;

namespace TodoApiTests.TaskTests;

public class TaskUnitTests
{

    public List<TaskModel> GetMockData()
    {
        var tasks = new List<TaskModel>
        {
            new TaskModel
            {
                Id = 1,
                Name = "Task 1",
                IsComplete = false,
                CreationTime = DateTime.Now
            },
            new TaskModel
            {
                Id = 2,
                Name = "Task 2",
                IsComplete = true,
                CreationTime = DateTime.Now
            },
            new TaskModel
            {
                Id = 3,
                Name = "Task 3",
                IsComplete = false,
                CreationTime = DateTime.Now
            },
            new TaskModel
            {
                Id = 4,
                Name = "Task 4",
                IsComplete = true,
                CreationTime = DateTime.Now
            }
        };
        return tasks;
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsTask()
    {
        // Arrange
        var mockService = new Mock<ITaskService>();
     
        mockService.Setup(service => service.GetTaskByIdAsync(1)).ReturnsAsync(GetMockData().FirstOrDefault(t => t.Id == 1));
        var controller = new TasksController(mockService.Object);

        // Act
        var result = await controller.Get(1);
        // result.Result
        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
        var value = (result.Result as OkObjectResult)?.Value;
        Assert.NotNull(value);
        
    }

    [Fact]
    public async Task AddTaskAsync_ReturnsTask()
    {
        // Arrange
        var mockService = new Mock<ITaskService>();
        var task = new TaskModel
        {
            Id = 5,
            Name = "Task 5",
            IsComplete = false,
            CreationTime = DateTime.Now
        };
        mockService.Setup(service => service.AddTaskAsync(task)).ReturnsAsync(task);
        var controller = new TasksController(mockService.Object);

        // Act
        var result = await controller.Post(task);

        // Assert

        Assert.IsType<CreatedODataResult<TaskModel>>(result);

    }

    [Fact]
    public async Task UpdateTaskAsync_ReturnsTask()
    {
        // Arrange
        var mockService = new Mock<ITaskService>();
        var task = new TaskModel
        {
            Id = 1,
            Name = "Task 1",
            IsComplete = true,
            CreationTime = DateTime.Now
        };
        mockService.Setup(service => service.UpdateTaskAsync(1, task)).ReturnsAsync(task);
        var controller = new TasksController(mockService.Object);

        // Act
        var result = await controller.Put(1, task);

        // Assert
        Assert.IsType<UpdatedODataResult<TaskModel>>(result);
    }

    [Fact]
    public async Task PatchTaskAsync_ReturnsTask()
    {
        // Arrange
        var mockService = new Mock<ITaskService>();
        var task = new TaskModel
        {
            Id = 1,
            Name = "Task 1",
            IsComplete = true,
            CreationTime = DateTime.Now
        };
        var delta = new Delta<TaskModel>();
        delta.TrySetPropertyValue("IsComplete", true);
        mockService.Setup(service => service.PatchTaskAsync(1, delta)).ReturnsAsync(task);
        var controller = new TasksController(mockService.Object);

        // Act
        var result = await controller.Patch(1, delta);

        // Assert
        Assert.IsType<UpdatedODataResult<TaskModel>>(result);
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsTask()
    {
        // Arrange
        var mockService = new Mock<ITaskService>();
        var task = new TaskModel
        {
            Id = 1,
            Name = "Task 1",
            IsComplete = true,
            CreationTime = DateTime.Now
        };
        mockService.Setup(service => service.DeleteTaskAsync(1)).ReturnsAsync(task);
        var controller = new TasksController(mockService.Object);

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }
}