### Repository verification limitation

The repository defines an `npm run lint` script, but ESLint is not declared as
a project dependency. The lint command therefore fails with
`eslint: command not found`.

This appears to be a project-configuration issue rather than a lint failure in
the application code.