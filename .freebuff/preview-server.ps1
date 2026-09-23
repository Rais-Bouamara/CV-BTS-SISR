$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:8099/")
$listener.Start()

while ($true) {
    $ctx = $listener.GetContext()
    $rel = $ctx.Request.Url.LocalPath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel

    if (Test-Path $path -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        switch ([System.IO.Path]::GetExtension($path).ToLower()) {
            ".html" { $ctx.Response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $ctx.Response.ContentType = "text/css; charset=utf-8" }
            ".js"   { $ctx.Response.ContentType = "application/javascript; charset=utf-8" }
            ".jpg"  { $ctx.Response.ContentType = "image/jpeg" }
            ".jpeg" { $ctx.Response.ContentType = "image/jpeg" }
            ".png"  { $ctx.Response.ContentType = "image/png" }
            ".svg"  { $ctx.Response.ContentType = "image/svg+xml" }
            ".pdf"  { $ctx.Response.ContentType = "application/pdf" }
            default { $ctx.Response.ContentType = "application/octet-stream" }
        }
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
