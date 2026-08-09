# HW57 — Basic HTTP Server (Node.js `http` module)

A basic HTTP server built with Node.js's built-in `http` module only (no
third-party frameworks such as Express). It serves statically generated HTML
pages for a few GET routes and handles a `POST /submit` form submission.

## Project structure

```
hw57/
├── server.js         # Entry point: creates and starts the HTTP server
├── router.js         # Routing logic: matches method + pathname to a handler
├── submitHandler.js  # POST /submit: body reading, size limit, parsing, validation
├── htmlTemplates.js  # HTML page generation (one function per page)
├── sanitize.js        # escapeHtml() — basic XSS protection for echoed input
├── response.js        # sendHtml() — sends a response with the correct headers
└── README.md
```

## Installation & running

No dependencies are required — only Node.js built-in modules (`http`, `url`,
`querystring`) are used.

1. Make sure [Node.js](https://nodejs.org/) is installed (v14+ recommended).
2. From the `hw57` directory, start the server:

   ```bash
   node server.js
   ```

3. By default the server listens on port `3000`. To use a different port, set
   the `PORT` environment variable:

   ```bash
   # bash / macOS / Linux
   PORT=5000 node server.js

   # Windows PowerShell
   $env:PORT=5000; node server.js
   ```

4. Open `http://localhost:3000/` in a browser, or test with `curl` /
   Postman (examples below).

## Routes

### `GET /`

Returns the Home page.

```bash
curl -i http://localhost:3000/
```

Response: `200 OK`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Home</title>
</head>
<body>
<h1>Home</h1>
<p>Welcome to the Home Page</p>
</body>
</html>
```

### `GET /about`

Returns the About page.

```bash
curl -i http://localhost:3000/about
```

Response: `200 OK` — heading "About", text "Learn more about us".

### `GET /contact`

Returns the Contact page.

```bash
curl -i http://localhost:3000/contact
```

Response: `200 OK` — heading "Contact", text "Get in touch".

### `GET *` (any other path)

Any route that isn't `/`, `/about` or `/contact` returns `404 Not Found`.

```bash
curl -i http://localhost:3000/unknown-page
```

Response: `404 Not Found`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>404 Not Found</title>
</head>
<body>
<h1>Page Not Found</h1>
<p>Page Not Found</p>
</body>
</html>
```

### `POST /submit`

Accepts `application/x-www-form-urlencoded` data with `name` and `email`
fields and returns a confirmation page. Input is HTML-escaped before being
echoed back to prevent XSS.

```bash
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John Doe&email=john@example.com"
```

Response: `200 OK`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Form Submitted</title>
</head>
<body>
<h1>Form Submitted</h1>
<p>Name: John Doe</p>
<p>Email: john@example.com</p>
</body>
</html>
```

**Missing/empty fields** — returns `400 Bad Request`:

```bash
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=&email="
```

Response: `400 Bad Request` with the message "Invalid form data".

**Body too large** — if the request body exceeds 1 MB, the server responds
with `413 Payload Too Large` and stops reading the request.

```bash
# Generates a body larger than 1 MB
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=$(head -c 2000000 </dev/zero | tr '\0' 'a')&email=a@a.com"
```

Response: `413 Payload Too Large`.

## Response headers

Every response includes:

- `Content-Type: text/html; charset=utf-8`
- `Content-Length` — the exact byte size of the response body.
- `X-Content-Type-Options: nosniff` — prevents browsers from MIME-sniffing
  the response away from the declared content type.

## Error handling

| Status | When it occurs |
| --- | --- |
| `404 Not Found` | Request to a route that doesn't exist. |
| `400 Bad Request` | POST `/submit` with a missing/empty `name` or `email`. |
| `413 Payload Too Large` | POST request body larger than 1 MB. |
| `500 Server Error` | Any unexpected error while handling a request. |

## Implementation notes & limitations

- Routing, request parsing and body-size limiting are implemented manually
  using only Node's built-in `http`, `url` and `querystring` modules — no
  Express or other third-party libraries.
- Maximum POST body size is **1 MB**; larger requests are rejected with
  `413` as soon as the limit is exceeded, without buffering the full body in
  memory.
- Only `application/x-www-form-urlencoded` bodies are supported for
  `POST /submit` (e.g. JSON bodies are not parsed).
- User-supplied `name`/`email` values are HTML-escaped (`&`, `<`, `>`, `"`,
  `'`) before being rendered back into the confirmation page to mitigate
  reflected XSS.
- The HTML pages are minimal and statically generated on each request; there
  is no templating engine or static file serving involved.
