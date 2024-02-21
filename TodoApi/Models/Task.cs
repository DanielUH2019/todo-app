namespace TodoApi.Models;
using Microsoft.OData.Edm;

public class TaskModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsComplete { get; set; }
    public Date CreationTime { get; set; }
}
