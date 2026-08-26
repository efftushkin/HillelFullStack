# hw63-express-jwt

A **Node.js** and **Express.js** RESTful API server, built on the **MVC (Model-View-Controller)** architectural pattern. It extends the previous homework (`hw62-express-pug-ejs`) with:

- a shared **favicon** served on every HTML page (PUG and EJS alike);
- a **theme preference** (light/dark) persisted in a cookie via `cookie-parser`;
- **JWT-based authentication** — registration and login routes that issue a JSON Web Token, stored in an `httpOnly` cookie, and a middleware that verifies the token to protect routes.

The `GET /users`, `GET /users/:userId`, `GET /articles` and `GET /articles/:articleId` pages are rendered as HTML using template engines — **PUG** for users, **EJS** for articles. Write operations (`POST`/`PUT`/`DELETE`) still return plain text/JSON.

## Project Structure

```
hw63-express-jwt/
├── index.js                       # Entry point - starts the server on port 3000
├── src/
│   ├── app.js                     # Express app setup, view engines, static files, middleware wiring
│   ├── config/
│   │   ├── jwt.js                 # JWT secret/expiry and auth-cookie settings
│   │   └── theme.js               # Theme cookie name, valid values, default, max-age
│   ├── controllers/                # Request handling logic (the "C" in MVC)
│   │   ├── rootController.js
│   │   ├── usersController.js      # Renders PUG views for GET /users and GET /users/:userId
│   │   ├── articlesController.js   # Renders EJS views for GET /articles and GET /articles/:articleId
│   │   ├── authController.js       # Register/login/logout/me - issues and reads JWTs
│   │   └── themeController.js      # Saves the chosen theme into a cookie
│   ├── data/                       # In-memory sample data used by the views
│   │   ├── users.js                 # Sample users shown on the /users pages
│   │   ├── articles.js
│   │   └── accounts.js              # In-memory auth accounts (username + hashed password)
│   ├── middlewares/                # Cross-cutting request processing logic
│   │   ├── logger.js               # Request logging
│   │   ├── session.js              # Session management
│   │   ├── auth.js                 # JWT verification (reads the token cookie or Authorization header)
│   │   ├── theme.js                # Reads the theme cookie into res.locals.theme for every view
│   │   ├── validateUser.js         # Validation for user data/params
│   │   ├── articleAccess.js        # Access control + validation for articles
│   │   └── errorHandler.js         # 404 and centralized error handling
│   ├── routes/                     # Route definitions, mapped to controllers + middlewares
│   │   ├── index.js                # Aggregates all route modules
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   ├── articlesRoutes.js
│   │   ├── authRoutes.js           # /auth/register, /auth/login, /auth/logout, /auth/me
│   │   └── themeRoutes.js          # /theme
│   ├── views/                      # Templates rendered by the two view engines
│   │   ├── layout.pug              # Shared PUG layout (favicon, theme toggle, header/nav/footer)
│   │   ├── users/
│   │   │   ├── list.pug            # GET /users
│   │   │   ├── details.pug         # GET /users/:userId
│   │   │   └── not-found.pug       # 404 page for an unknown userId
│   │   ├── articles/
│   │   │   ├── list.ejs            # GET /articles
│   │   │   ├── details.ejs         # GET /articles/:articleId
│   │   │   └── not-found.ejs       # 404 page for an unknown articleId
│   │   └── partials/
│   │       ├── header.ejs          # Shared EJS header/nav/theme toggle (favicon, data-theme)
│   │       └── footer.ejs          # Shared EJS footer
│   └── public/
│       ├── favicon.ico             # Served at /favicon.ico by express.static
│       └── css/
│           └── style.css           # Shared stylesheet, includes the light/dark theme palette
├── package.json
└── README.md
```

Controllers contain the logic for handling each request, route modules define which controller function (and which middlewares) handle each HTTP method and path, and middlewares implement the reusable, cross-cutting behavior (logging, sessions, security, validation, error handling) that runs before controllers execute.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

## Installation

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

## Running the Server

Start the server with:

```bash
npm start
```

The server listens on port **3000**. You should see:

```
Server is running on http://localhost:3000
```

You can then send requests to `http://localhost:3000` using a browser, `curl`, or a tool like Postman.

## Template Engines

| Engine | Used for | Views directory | Layout/partials strategy |
| --- | --- | --- | --- |
| [PUG](https://pugjs.org/) | `GET /users`, `GET /users/:userId` | `src/views/users/` | `src/views/layout.pug` shared layout, extended via `extends` / `block content` |
| [EJS](https://ejs.co/) | `GET /articles`, `GET /articles/:articleId` | `src/views/articles/` | `src/views/partials/header.ejs` and `footer.ejs`, pulled in with `<%- include(...) %>` |

Both engines are registered in `src/app.js`:

```js
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');      // default engine, used by usersController
app.engine('ejs', ejs.renderFile);  // articlesController renders with the explicit .ejs extension
```

Sample data for the views lives in `src/data/users.js` and `src/data/articles.js` (in-memory arrays, no database). Requesting an unknown `userId`/`articleId` renders a dedicated "not found" view with a `404` status instead of plain text. A shared stylesheet (`src/public/css/style.css`, served via `express.static`) styles both the PUG and EJS pages consistently (header/nav, theme toggle, card list, detail card, buttons), including a dark-mode palette selected via `[data-theme="dark"]`.

## Static Files & Favicon

`src/public/` is served as static content via `express.static` (mounted in `src/app.js`), the same way `css/style.css` already was. `src/public/favicon.ico` is added to that folder, so Express serves it automatically at `GET /favicon.ico` — no extra route is needed.

Every HTML template includes:

```html
<link rel="icon" href="/favicon.ico">
```

- PUG: `link(rel="icon" href="/favicon.ico")` in `src/views/layout.pug` — inherited by every page that `extends` it (`users/list`, `users/details`, `users/not-found`).
- EJS: the same `<link>` tag in `src/views/partials/header.ejs` — included by every EJS page (`articles/list`, `articles/details`, `articles/not-found`).

## Cookies: Theme Preference

| Middleware / Route | File | Purpose |
| --- | --- | --- |
| `cookieParser()` | `src/app.js` | Parses the `Cookie` request header into `req.cookies` (from the `cookie-parser` package). |
| `themeLoader` | `src/middlewares/theme.js` | Global middleware. Reads the `theme` cookie (`light` or `dark`, defaults to `light` if missing/invalid) and exposes it as `res.locals.theme`, so every rendered view has access to `theme` without each controller passing it explicitly. |
| `POST /theme` | `src/controllers/themeController.js` | Saves the user's chosen theme. Reads `theme` from the request body (`light`/`dark`), rejects anything else with `400`, otherwise sets a `theme` cookie (1 year `maxAge`, `SameSite=Lax`) and redirects back to the page the request came from (`Referer` header, falling back to `/`). |

Every rendered page (PUG and EJS) has a small "☀ Light / 🌙 Dark" form in the header that posts to `/theme`; the active choice is highlighted, and `<html data-theme="...">` switches the CSS custom properties defined in `src/public/css/style.css` between the light and dark palette. The cookie is not `httpOnly`, since it only stores a non-sensitive UI preference.

```bash
# Save the "dark" theme (cookie persists for later requests, and the client is
# redirected - use -i to see the Set-Cookie header, or -c to save it to a jar)
curl -i -X POST -d "theme=dark" http://localhost:3000/theme

# Reuse the saved theme on a later request
curl -c cookies.txt -X POST -d "theme=dark" http://localhost:3000/theme -o /dev/null
curl -b cookies.txt http://localhost:3000/articles   # rendered with data-theme="dark"

# Invalid value
curl -i -X POST -d "theme=neon" http://localhost:3000/theme   # 400
```

## JWT Authentication

| Piece | File | Purpose |
| --- | --- | --- |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | `src/config/jwt.js` | Signing secret (from `process.env.JWT_SECRET`, with a development fallback) and token lifetime (`1h`). |
| `accounts` | `src/data/accounts.js` | In-memory list of registered accounts (`{ id, username, passwordHash }`), separate from the sample `users` data used by the `/users` pages. Seeded with one demo account: **username `demo`, password `demo1234`**. |
| `authenticate` | `src/middlewares/auth.js` | Reads the JWT from the `token` cookie, or from an `Authorization: Bearer <token>` header as a fallback. Responds `401` if no token is present, or if `jwt.verify` fails (invalid signature/expired); otherwise attaches the decoded payload to `req.user` and calls `next()`. Protects `GET /users*` and `GET /auth/me`. |
| `register` / `login` / `logout` / `getCurrentUser` | `src/controllers/authController.js` | See routes below. |

Passwords are hashed with `bcryptjs` before being stored; they are never kept or returned in plain text. On successful register/login, the server:

1. Signs a JWT containing `{ id, username }` with `JWT_SECRET`, expiring in 1 hour.
2. Sets it as a cookie named `token` with `httpOnly: true` (not readable from client-side JavaScript), `sameSite: 'lax'`, `maxAge` matching the token's lifetime.
3. Also returns the same token in the JSON response body, so the routes can be exercised with plain `curl` without a cookie jar.

### Auth routes (`src/routes/authRoutes.js`, mounted at `/auth`)

| Method | Path | Auth required | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | `{ "username", "password" }` | `201` + `{ message, user, token }`, sets the `token` cookie. `400` if fields are missing, `409` if the username is taken. |
| POST | `/auth/login` | No | `{ "username", "password" }` | `200` + `{ message, user, token }`, sets the `token` cookie. `400` if fields are missing, `401` if the credentials are invalid. |
| POST | `/auth/logout` | No | — | `200` + `{ message }`, clears the `token` cookie. |
| GET | `/auth/me` | **Yes (JWT)** | — | `200` + `{ user }` with the decoded token payload. `401` if not authenticated. |

```bash
# Register a new account (also logs it in - cookie saved to jar for reuse)
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alice123"}' http://localhost:3000/auth/register

# Log in with the seeded demo account
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo1234"}' http://localhost:3000/auth/login

# Check who the token belongs to (cookie-based)
curl -b cookies.txt http://localhost:3000/auth/me

# Log out (clears the cookie server-side)
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout

# Alternative: send the token via header instead of a cookie
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo1234"}' http://localhost:3000/auth/login \
  | node -e "process.stdin.on('data', d => console.log(JSON.parse(d).token))")
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/users
```

## Middlewares

### Global middlewares (applied to every request, in `src/app.js`)

| Middleware | File | Purpose |
| --- | --- | --- |
| `requestLogger` | `src/middlewares/logger.js` | Logs the timestamp, HTTP method and URL of every incoming request to the console. |
| `cookieParser` | `cookie-parser` package | Parses cookies from the request header into `req.cookies`. |
| `sessionManager` | `src/middlewares/session.js` | Reads the `X-Session-Id` request header. If it is missing or unknown, generates a new session id and stores basic session data (creation time, request count, last access time) in an in-memory store. Attaches the session to `req.session` / `req.sessionId` and echoes the id back via the `X-Session-Id` response header. |
| `express.json` / `express.urlencoded` | Express built-ins | Parse JSON bodies (used by `/auth/*`) and URL-encoded form bodies (used by `/theme`). |
| `express.static` | Express built-in | Serves `src/public/` (CSS and `favicon.ico`). |
| `themeLoader` | `src/middlewares/theme.js` | Reads the `theme` cookie into `res.locals.theme` for every view render. |
| `notFoundHandler` | `src/middlewares/errorHandler.js` | Runs after all routes; returns a plain-text `404` for any URL that doesn't match a defined route. |
| `errorHandler` | `src/middlewares/errorHandler.js` | Centralized 4-argument Express error handler. Logs the error, returns `400` for malformed JSON bodies, and `500` (or `err.statusCode`) for anything else. |

### `/users` and `/users/:userId` middlewares (`src/routes/usersRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `authenticate` | `src/middlewares/auth.js` | All `/users` routes | Requires a valid JWT, via the `token` cookie or an `Authorization: Bearer <token>` header. Responds `401` if it is missing or fails verification, otherwise attaches the decoded payload to `req.user` and calls `next()`. |
| `validateUserId` | `src/middlewares/validateUser.js` | Routes with `:userId` (`GET/PUT/DELETE /users/:userId`) | Responds `400` unless `userId` is a numeric string. |
| `validateUserInput` | `src/middlewares/validateUser.js` | `POST /users`, `PUT /users/:userId` | Responds `400` unless the request body contains both `username` and `password`. |

### `/articles` and `/articles/:articleId` middlewares (`src/routes/articlesRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `checkArticleAccess` | `src/middlewares/articleAccess.js` | All `/articles` routes | Reads the `x-role` request header (defaults to `guest`). `GET` requests are allowed for any role; `POST`/`PUT`/`DELETE` require role `admin` or `editor`, otherwise responds `403`. |
| `validateArticleId` | `src/middlewares/articleAccess.js` | Routes with `:articleId` (`GET/PUT/DELETE /articles/:articleId`) | Responds `400` unless `articleId` is a numeric string. |

## API Routes

The read (`GET`) routes for `/users` and `/articles` render **HTML** pages (PUG or EJS, see [Template Engines](#template-engines)); the `/auth` routes return **JSON**; every other route still returns plain text.

### Root

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/` | logging, session | `Get root route` |

### Theme

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| POST | `/theme` | — | Sets the `theme` cookie and redirects back to the referring page. `400` for an invalid value. |

### Auth

See [JWT Authentication](#jwt-authentication) above for the full table.

### Users

Requires a valid JWT (see [JWT Authentication](#jwt-authentication)) on every request. Sample data comes from `src/data/users.js` (ids `1`–`4`).

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/users` | auth (JWT) | HTML page (PUG) — list of users |
| POST | `/users` | auth (JWT), validate body | `Post users route` |
| GET | `/users/:userId` | auth (JWT), validate id | HTML page (PUG) — user details, or a `404` HTML page if the id is unknown |
| PUT | `/users/:userId` | auth (JWT), validate id, validate body | `Put user by Id route: {userId}` |
| DELETE | `/users/:userId` | auth (JWT), validate id | `Delete user by Id route: {userId}` |

### Articles

Optionally send header `x-role: admin` or `x-role: editor` to perform write operations (`POST`/`PUT`/`DELETE`); reads (`GET`) work for any role, including no header at all (defaults to `guest`). Sample data comes from `src/data/articles.js` (ids `1`–`3`).

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/articles` | access control | HTML page (EJS) — list of articles |
| POST | `/articles` | access control (admin/editor only) | `Post articles route` |
| GET | `/articles/:articleId` | access control, validate id | HTML page (EJS) — article details, or a `404` HTML page if the id is unknown |
| PUT | `/articles/:articleId` | access control (admin/editor only), validate id | `Put article by Id route: {articleId}` |
| DELETE | `/articles/:articleId` | access control (admin/editor only), validate id | `Delete article by Id route: {articleId}` |

### Example requests

```bash
# Root
curl http://localhost:3000/

# Favicon
curl -i http://localhost:3000/favicon.ico

# Theme
curl -i -X POST -d "theme=dark" http://localhost:3000/theme

# Auth - register, login, check identity, logout
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo1234"}' http://localhost:3000/auth/login
curl -b cookies.txt http://localhost:3000/auth/me
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout

# Users - requires a JWT. Log in first and reuse the cookie jar, or pass the
# token via the Authorization header (see the "Auth routes" section above).
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo1234"}' http://localhost:3000/auth/login
curl -b cookies.txt http://localhost:3000/users
curl -b cookies.txt http://localhost:3000/users/1
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret"}' http://localhost:3000/users
curl -b cookies.txt -X PUT -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret"}' http://localhost:3000/users/1
curl -b cookies.txt -X DELETE http://localhost:3000/users/1

# Articles - GET works without any role header (and without auth), so these
# pages can be opened directly in a browser
curl http://localhost:3000/articles
curl http://localhost:3000/articles/2
curl -X POST -H "x-role: editor" http://localhost:3000/articles
curl -X PUT -H "x-role: admin" http://localhost:3000/articles/2
curl -X DELETE -H "x-role: admin" http://localhost:3000/articles/2

# Error cases
curl http://localhost:3000/users                                    # 401 - no token
curl -b cookies.txt http://localhost:3000/users/abc                 # 400 - invalid userId
curl -b cookies.txt http://localhost:3000/users/999                 # 404 - HTML "not found" page (PUG)
curl http://localhost:3000/articles/999                             # 404 - HTML "not found" page (EJS)
curl -X POST http://localhost:3000/articles                         # 403 - guest role can't write
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"wrong"}' http://localhost:3000/auth/login  # 401 - bad credentials
curl -i -X POST -d "theme=neon" http://localhost:3000/theme         # 400 - invalid theme value
curl http://localhost:3000/some/unknown/path                        # 404 - unknown route
curl -X POST -H "Content-Type: application/json" -d '{invalid-json' \
  http://localhost:3000/auth/login                                  # 400 - malformed JSON, caught by errorHandler
```

## Package Manager

This project uses **npm** for dependency management (`package.json` / `package-lock.json`).
