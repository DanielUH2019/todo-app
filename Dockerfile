# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source
COPY "./todo-app.sln" .
COPY TodoApi /TodoApi/
RUN dotnet restore /TodoApi/TodoApi.csproj --disable-parallel
RUN dotnet publish /TodoApi/TodoApi.csproj -c Release -o /app --no-restore

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./

EXPOSE 7203

ENTRYPOINT [ "dotnet", "TodoApi.dll" ]