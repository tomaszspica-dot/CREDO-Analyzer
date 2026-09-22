# Security

Do not publish credentials, API tokens, private environment files,
local runtime databases or log files.

Security-sensitive findings should not include live credentials in
public GitHub issues.

Runtime data and local configuration should remain outside the
repository whenever possible.

The repository `.gitignore` excludes common sensitive and runtime
artifacts, but contributors remain responsible for reviewing changes
before every commit.
