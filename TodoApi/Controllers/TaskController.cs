namespace TodoApi.Controllers
{
    using System.Linq;
    using TodoApi.Data;
    using TodoApi.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.OData.Deltas;
    using Microsoft.AspNetCore.OData.Routing.Controllers;

    public class TaskController : ODataController
    {
        private readonly TaskDbContext db;

        public TaskController(TaskDbContext db)
        {
            this.db = db;
        }

        public ActionResult<IQueryable<Task>> Get()
        {
            return Ok(db.Tasks);
        }

        public ActionResult<Task> Get([FromRoute] int key)
        {
            var customer = db.Tasks.SingleOrDefault(d => d.Id == key);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        public ActionResult Post([FromBody] Task customer)
        {
            db.Tasks.Add(customer);

            return Created(customer);
        }

        public ActionResult Put([FromRoute] int key, [FromBody] Task updatedTask)
        {
            var task = db.Tasks.SingleOrDefault(d => d.Id == key);

            if (task == null)
            {
                return NotFound();
            }

            task.Name = updatedTask.Name;
            task.IsComplete = updatedTask.IsComplete;

            db.SaveChanges();

            return Updated(task);
        }

        public ActionResult Patch([FromRoute] int key, [FromBody] Delta<Task> delta)
        {
            var task = db.Tasks.SingleOrDefault(d => d.Id == key);

            if (task == null)
            {
                return NotFound();
            }

            delta.Patch(task);

            db.SaveChanges();

            return Updated(task);
        }

        public ActionResult Delete([FromRoute] int key)
        {
            var customer = db.Tasks.SingleOrDefault(d => d.Id == key);

            if (customer != null)
            {
                db.Tasks.Remove(customer);
            }

            db.SaveChanges();

            return NoContent();
        }
    }
}