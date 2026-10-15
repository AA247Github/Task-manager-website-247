using System.Net; // Provides HttpStatusCode (OK, NotFound and so on)
using Microsoft.AspNetCore.Hosting; // Provides UseSetting
using Microsoft.AspNetCore.Mvc.Testing; // Provides WebApplicationFactory, which runs the API in memory

namespace TaskManager.IntegrationTests;

// Tests for GET /health.
// IClassFixture makes xUnit create one factory (one in-memory API) and share it across these tests.
public class HealthEndpointTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact] // Marks this method as a test for xUnit to run
    public async Task GetHealth_ReturnsOkWithHealthyStatus()
    {
        // Arrange: start the API in memory and get a client that can call it
        var client = factory.CreateClient();

        // Act: send GET /health and wait for the response
        var response = await client.GetAsync("/health");

        // Assert: the status is 200 OK and the body says "Healthy"
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

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

    [Fact]
    public async Task GetHealth_OverPlainHttp_IsNotRedirected()
    {
        // Arrange: tell the app it has an https port (as it would in production),
        // and use a client that reports redirects instead of following them
        var client = factory
            .WithWebHostBuilder(builder => builder.UseSetting("https_port", "443"))
            .CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        // Act: call /health over plain http
        var response = await client.GetAsync("/health");

        // Assert: answered directly with 200, not redirected (307) to https
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
