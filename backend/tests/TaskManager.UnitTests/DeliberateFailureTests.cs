namespace TaskManager.UnitTests;

// THROWAWAY (KAN-13): proves a failing test turns the CI check red. This PR is closed, never merged.
public class DeliberateFailureTests
{
    [Fact]
    public void This_test_fails_on_purpose_to_prove_CI_catches_it()
    {
        Assert.Fail("Deliberate failure for KAN-13: CI should go red");
    }
}
