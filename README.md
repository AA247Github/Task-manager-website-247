# v0-task-manager-website

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_PNiCX0ryvODRXN510k2WgxUt9130)

## Getting Started

Run the development server from the repository root (the scripts use `frontend` as the Next.js project directory):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `frontend/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

## Backend

The backend is an ASP.NET Core Web API written in C#.

### Projects

- `TaskManager.Api` — hosts the HTTP API.
- `TaskManager.UnitTests` — contains isolated business-logic tests.
- `TaskManager.IntegrationTests` — verifies the API and its integrations.

### Requirements

- .NET 10 SDK

Check the installed version:

```bash
dotnet --version
```

### Restore dependencies

```bash
dotnet restore backend/TaskManager.slnx
```

### Build

```bash
dotnet build backend/TaskManager.slnx --no-restore
```

### Test

```bash
dotnet test backend/TaskManager.slnx --no-build
```

Test naming, structure and independence rules are in [backend/tests/README.md](backend/tests/README.md).

### Run the API

```bash
dotnet run --project backend/src/TaskManager.Api/TaskManager.Api.csproj
```

### Health check

`GET /health` reports whether the API is running.

| Status | Body | Meaning |
|---|---|---|
| `200 OK` | `Healthy` | The API is running and all checks pass |
| `503 Service Unavailable` | `Unhealthy` | One or more checks failed |

The response is plain text (`text/plain`). Use this endpoint for container and deployment health checks.

```bash
curl -i http://localhost:5057/health
```
