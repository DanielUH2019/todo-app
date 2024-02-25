namespace TodoApi.Controllers
{
    using System.Linq;
    using TodoApi.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.OData.Deltas;
    using Microsoft.AspNetCore.OData.Routing.Controllers;
    using TodoApi.Services;
    using Microsoft.AspNetCore.OData.Query;

    public class TasksController : ODataController
    {
        private readonly ITaskService _service;

        public TasksController(ITaskService service)
        {
            _service = service;
        }


        [EnableQuery(PageSize = 10, AllowedFunctions = AllowedFunctions.AllFunctions &
            ~AllowedFunctions.All & ~AllowedFunctions.Any, AllowedOrderByProperties = "Id,CreationTime,IsComplete,CompletedAt,Name")]
        public ActionResult<IQueryable<TaskModel>> Get()
        {
            return Ok(_service.GetTasks());
        }

        public async Task<ActionResult<TaskModel>> Get([FromRoute] int key)
        {
            var task = await _service.GetTaskByIdAsync(key);

            if (task is null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        public async Task<ActionResult> Post([FromBody] TaskModel task)
        {
            await _service.AddTaskAsync(task);

            return Created(task);
        }

        public async Task<ActionResult> Put([FromRoute] int key, [FromBody] TaskModel updatedTask)
        {
            
            var task = await _service.UpdateTaskAsync(key, updatedTask);

            if (task is null)
            {
                return NotFound();
            }

            return Updated(task);
        }

        public async Task<ActionResult> Patch([FromRoute] int key, [FromBody] Delta<TaskModel> delta)
        {
            var task = await _service.PatchTaskAsync(key, delta);

            if (task is null)
            {
                return NotFound();
            }

            return Updated(task);
        }

        public async Task<ActionResult> Delete([FromRoute] int key)
        {
            var task = await _service.DeleteTaskAsync(key);

            if (task is null)
            {
                return NotFound();
            }

            return Ok("Task deleted successfully.");
        }
    }
}