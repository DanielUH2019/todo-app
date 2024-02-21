// Program.cs
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
// OData namespaces
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;
using TodoApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using TodoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Create the service EDM model.
var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<Task>("Tasks");
var edmModel = modelBuilder.GetEdmModel();

// Register OData service.
builder.Services.AddControllers().AddOData(
    options => options.EnableQueryFeatures(null).AddRouteComponents(
        routePrefix: "odata",
        model: modelBuilder.GetEdmModel()));


builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseInMemoryDatabase("TaskDb"));

builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMvcCore(options =>
{
    foreach (var outputFormatter in options.OutputFormatters.OfType<OutputFormatter>().Where(x => x.SupportedMediaTypes.Count == 0))
    {
        outputFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/prs.odatatestxx-odata"));
    }

    foreach (var inputFormatter in

    options.InputFormatters.OfType<InputFormatter>().Where(

    x => x.SupportedMediaTypes.Count == 0))

    {

        inputFormatter.SupportedMediaTypes.Add(

        new MediaTypeHeaderValue(

        "application/prs.odatatestxx-odata"));

    }

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints => endpoints.MapControllers());

app.Run();
