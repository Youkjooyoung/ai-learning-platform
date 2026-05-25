param(
  [string]$BaseUrl = "http://127.0.0.1:8000"
)

$ErrorActionPreference = "Stop"

$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "smoke-$stamp@example.com"
$password = "password123"

$registerBody = @{
  email = $email
  password = $password
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/register" -Body $registerBody -ContentType "application/json" | Out-Null

$loginBody = "username=$([uri]::EscapeDataString($email))&password=$([uri]::EscapeDataString($password))"
$login = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/login" -Body $loginBody -ContentType "application/x-www-form-urlencoded"
$headers = @{ Authorization = "Bearer $($login.access_token)" }

$noteBody = @{
  title = "FastAPI"
  content = "Smoke test note"
  status = "draft"
  tags = @("api", "smoke")
} | ConvertTo-Json

$note = Invoke-RestMethod -Method Post -Uri "$BaseUrl/notes" -Headers $headers -Body $noteBody -ContentType "application/json"
Invoke-RestMethod -Method Post -Uri "$BaseUrl/notes/$($note.id)/summarize" -Headers $headers | Out-Null
$dashboard = Invoke-RestMethod -Method Get -Uri "$BaseUrl/dashboard/summary" -Headers $headers

if ($dashboard.total_notes -lt 1) {
  throw "dashboard total_notes is invalid"
}

Write-Output "smoke ok"

