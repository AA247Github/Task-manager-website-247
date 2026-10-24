# Backend test conventions

Rules for every test in `TaskManager.UnitTests` and `TaskManager.IntegrationTests`

## Which project a test belongs in

| Project | Tests | Runs against |
|---|---|---|
| `TaskManager.UnitTests` | One class or method in isolation: domain rules, validation, query building | Plain C# objects. No HTTP, no database, no file system |
| `TaskManager.IntegrationTests` | Behaviour through the real HTTP pipeline: status codes, routing, response bodies | The API running in memory via `WebApplicationFactory` |

The deciding question is whether the test calls the code directly or sends it an HTTP request.

- **Unit test:** call a C# method and check what it returns, for example `validator.Validate(task)`. Nothing is started and nothing goes over HTTP.
- **Integration test:** start the API and send it a request. `WebApplicationFactory` runs the API in memory, and `factory.CreateClient()` returns an `HttpClient`, the standard .NET class for sending HTTP requests (like `fetch` in JavaScript). The request goes through routing, middleware and the endpoint, the same path a browser request takes.

```csharp
var client = factory.CreateClient();                              // HttpClient pointed at the in-memory API
var response = await client.PostAsync("/health", content: null);  // send POST /health
```

If a test needs `HttpClient`, `WebApplicationFactory` or a database, it is an integration test. If a rule can be checked by calling a method directly, test it in the unit project; it is faster and pinpoints the failure.

Do not add placeholder tests: a test with no assertion always passes and reports coverage that does not exist.

## Naming: `Method_Scenario_Expected`

Each test name has up to three parts, separated by underscores:

1. **Method**: the thing being exercised (a method, or an HTTP method plus endpoint).
2. **Scenario**: the condition that makes this case different. Leave it out when there is only the normal case.
3. **Expected**: the observable result.

Examples from this repo:

| Test | Method | Scenario | Expected |
|---|---|---|---|
| `GetHealth_ReturnsOkWithHealthyStatus` | `GetHealth` | (normal case) | `ReturnsOkWithHealthyStatus` |
| `GetHealth_OverPlainHttp_IsNotRedirected` | `GetHealth` | `OverPlainHttp` | `IsNotRedirected` |
| `PostHealth_ReturnsMethodNotAllowed` | `PostHealth` | (normal case) | `ReturnsMethodNotAllowed` |

A failing name should tell you what broke without opening the file. `CreateTask_WithEmptyTitle_IsRejected` does; `Test1` or `CreateTaskTest` does not.

Test classes are named after what they cover, ending in `Tests`: `HealthEndpointTests`, and later for example `TaskValidatorTests`.

## Structure: Arrange, Act, Assert

Every test has three parts, marked with comments:

```csharp
[Fact]
public async Task PostHealth_ReturnsMethodNotAllowed()
{
    // Arrange: start the API in memory and get a client that can call it
    var client = factory.CreateClient();

    // Act: send POST /health with an empty body
    var response = await client.PostAsync("/health", content: null);

    // Assert: only GET is allowed, so POST is rejected with 405
    Assert.Equal(HttpStatusCode.MethodNotAllowed, response.StatusCode);
}
```

- **Arrange**: set up the inputs and the object under test.
- **Act**: do the one thing being tested. One action per test.
- **Assert**: check the outcome. Several asserts are fine if they describe the same outcome (for example status code and body).

If a test needs two Acts, it is two tests.

## Independence

Every test must pass when run alone, in any order, or in parallel with the others.

- **xUnit creates a new instance of the test class for every test**, so fields set in the constructor are fresh each time. Do not use `static` fields to pass data between tests.
- **`IClassFixture<T>` shares one object across a class's tests.** `HealthEndpointTests` shares one `WebApplicationFactory` (one in-memory API) because starting it is slow.
- **Never depend on run order.** xUnit does not guarantee it.
- **Each test creates the data it needs.** Do not rely on data left behind by another test.

To check a test is independent, run it on its own:

```bash
dotnet test backend/TaskManager.slnx --filter "FullyQualifiedName~PostHealth_ReturnsMethodNotAllowed"
```

## A test must be able to fail

Before relying on a new test, see it fail once: break the code it covers (or change the expected value) and confirm the test goes red, then restore it. This catches tests that pass whatever the code does.

## In CI

`.github/workflows/backend-ci.yml` runs `dotnet test` on the whole solution for every pull request into `main` and every push to `main`. Both test projects run; a failing test fails the check.

## Further reading

- [Unit testing best practices for .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices): naming, Arrange-Act-Assert, avoiding logic in tests
- [Shared context between tests (xUnit)](https://xunit.net/docs/shared-context): constructors, `IClassFixture` and collection fixtures
- [Integration tests in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests): `WebApplicationFactory`
