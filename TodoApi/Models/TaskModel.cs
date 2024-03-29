namespace TodoApi.Models;
using Microsoft.OData.Edm;

public class TaskModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsComplete { get; set; }
    public DateTimeOffset CreationTime { get; set; }
    public DateTimeOffset? CompletedAt {get; set;}
}
