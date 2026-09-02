# hw65-express-mongodb

A **Node.js** and **Express.js** RESTful API server, built on the **MVC (Model-View-Controller)** architectural pattern. It extends the previous homework (`hw64-express-passport`) by integrating the server with a **MongoDB Atlas** database via **Mongoose**:

- a shared **favicon** served on every HTML page (PUG and EJS alike);
- a **theme preference** (light/dark) persisted in a cookie via `cookie-parser`;
- **Passport-based authentication** — a `passport-local` strategy validates an email/password pair, and `express-session` persists the resulting login state server-side, identified by a session id stored in an `httpOnly` cookie;
- a **protected route** (`GET /protected`), plus the pre-existing `GET /users*` routes and `GET /auth/me`, all guarded by a Passport-session middleware that only lets a request through when it carries a valid, logged-in session;
- a **MongoDB Atlas connection** (via [Mongoose](https://mongoosejs.com/)), with the `GET /articles` and `GET /articles/:articleId` pages now reading their data from a real `articles` collection in the database instead of an in-memory array.

The `GET /users`, `GET /users/:userId`, `GET /articles` and `GET /articles/:articleId` pages are rendered as HTML using template engines — **PUG** for users, **EJS** for articles. Write operations (`POST`/`PUT`/`DELETE`) still return plain text/JSON.

## Project Structure

```
hw65-express-mongodb/
├── index.js                       # Entry point - loads .env, connects to MongoDB, then starts the server
├── .env                            # Local MongoDB Atlas credentials (git-ignored, not committed)
├── .env.example                    # Template listing the required environment variables
├── src/
│   ├── app.js                     # Express app setup, view engines, static files, middleware wiring
│   ├── config/
│   │   ├── db.js                  # Connects Mongoose to MongoDB Atlas using MONGODB_URI / MONGODB_DB_NAME
│   │   ├── passport.js            # Passport local strategy (email/password) + serialize/deserialize
│   │   ├── session.js             # express-session secret, cookie name and max-age
│   │   └── theme.js               # Theme cookie name, valid values, default, max-age
│   ├── controllers/                # Request handling logic (the "C" in MVC)
│   │   ├── rootController.js
│   │   ├── usersController.js      # Renders PUG views for GET /users and GET /users/:userId
│   │   ├── articlesController.js   # Renders EJS views for GET /articles and GET /articles/:articleId, reading from MongoDB
│   │   ├── authController.js       # Register/login/logout/me - built on Passport + express-session
│   │   ├── protectedController.js  # GET /protected - sample route guarded by a valid session
│   │   └── themeController.js      # Saves the chosen theme into a cookie
│   ├── models/
│   │   └── Article.js              # Mongoose schema/model for the "articles" collection
│   ├── scripts/
│   │   └── seedArticles.js         # One-off script (`npm run seed`) that loads src/data/articles.js into MongoDB
│   ├── data/                       # In-memory sample data used by the views
│   │   ├── users.js                 # Sample users shown on the /users pages
│   │   ├── articles.js              # Seed data for the MongoDB "articles" collection (see seedArticles.js)
│   │   └── accounts.js              # In-memory auth accounts (email + hashed password)
│   ├── middlewares/                # Cross-cutting request processing logic
│   │   ├── logger.js               # Request logging
│   │   ├── auth.js                 # ensureAuthenticated - checks req.isAuthenticated() (Passport session)
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
│   │   ├── protectedRoutes.js      # /protected
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
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier is enough) with a database user and its connection string

## Installation

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the MongoDB Atlas connection - copy `.env.example` to `.env` and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   ```
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-host>"
   MONGODB_DB_NAME="hw65-express-mongodb"
   ```

   - `MONGODB_URI` is the Atlas SRV connection string (from **Atlas → Connect → Drivers**), including your database user's username and password.
   - `MONGODB_DB_NAME` is the database name Mongoose connects to (created automatically on first write if it doesn't exist yet).
   - In **Atlas → Network Access**, make sure your current IP address (or `0.0.0.0/0` for unrestricted access during development) is on the cluster's IP access list, otherwise the connection is rejected.
   - `.env` is git-ignored and never committed - see [MongoDB Atlas Integration](#mongodb-atlas-integration) below for details.

4. Seed the `articles` collection with the sample data (only needed once, or whenever you want to reset it):

   ```bash
   npm run seed
   ```

## Running the Server

Start the server with:

```bash
npm start
```

The server first connects to MongoDB Atlas, then starts listening on port **3000**. You should see:

```
Connected to MongoDB Atlas (database: hw65-express-mongodb)
Server is running on http://localhost:3000
```

If the connection fails (bad credentials, IP not whitelisted, etc.), the error is logged and the process exits instead of starting the server without a database.

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

Sample data for the `/users` pages lives in `src/data/users.js` (an in-memory array, no database). The `/articles` pages read from a MongoDB Atlas `articles` collection instead - see [MongoDB Atlas Integration](#mongodb-atlas-integration). Requesting an unknown `userId`/`articleId` renders a dedicated "not found" view with a `404` status instead of plain text. A shared stylesheet (`src/public/css/style.css`, served via `express.static`) styles both the PUG and EJS pages consistently (header/nav, theme toggle, card list, detail card, buttons), including a dark-mode palette selected via `[data-theme="dark"]`.

## Static Files & Favicon

`src/public/` is served as static content via `express.static` (mounted in `src/app.js`), the same way `css/style.css` already was. `src/public/favicon.ico` is added to that folder, so Express serves it automatically at `GET /favicon.ico` — no extra route is needed.

Every HTML template includes:

```html
<link rel="icon" href="/favicon.ico">
```

- PUG: `link(rel="icon" href="/favicon.ico")` in `src/views/layout.pug` — inherited by every page that `extends` it (`users/list`, `users/details`, `users/not-found`).
- EJS: the same `<link>` tag in `src/views/partials/header.ejs` — included by every EJS page (`articles/list`, `articles/details`, `articles/not-found`).

## MongoDB Atlas Integration

The server is connected to a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster using [Mongoose](https://mongoosejs.com/), MongoDB's Object Data Modeling (ODM) library for Node.js. The `articles` collection replaces the in-memory `src/data/articles.js` array as the data source for the `GET /articles` and `GET /articles/:articleId` pages.

| Piece | File | Purpose |
| --- | --- | --- |
| `.env` | project root (git-ignored) | Holds `MONGODB_URI` (the Atlas SRV connection string) and `MONGODB_DB_NAME`. Loaded via [`dotenv`](https://github.com/motdotla/dotenv) at the top of `index.js`. Based on `.env.example`, which documents the required variables without real credentials. |
| `connectDB()` | `src/config/db.js` | Opens the Mongoose connection with `mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })`. Throws a clear error if `MONGODB_URI` is missing. |
| `Article` model | `src/models/Article.js` | Mongoose schema for one article document: `id` (Number, unique), `title`, `author`, `publishedAt`, `content` (all String, required). The numeric `id` field (not Mongo's `_id`) keeps it compatible with the existing `:articleId` routes and `validateArticleId` middleware, which only accept a plain numeric string. |
| `seedArticles.js` | `src/scripts/seedArticles.js`, run via `npm run seed` | Connects to the database and upserts each article from `src/data/articles.js` into the `articles` collection, matched by `id`. Safe to run multiple times - it updates existing articles instead of duplicating them. |

**Startup sequence** (`index.js`): `dotenv` loads `.env` → `connectDB()` establishes the Mongoose connection → only once that succeeds does `app.listen()` start accepting HTTP requests. This avoids serving requests that would otherwise fail because the database isn't reachable yet.

**Read route** (`src/controllers/articlesController.js`):

```js
const getArticles = async (req, res) => {
  const articles = await Article.find().sort({ id: 1 });
  res.render('articles/list.ejs', { title: 'Articles', articles });
};

const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findOne({ id: Number(articleId) });
  // ...renders articles/details.ejs, or a 404 page if not found
};
```

Both handlers are `async` functions that query MongoDB through the `Article` model and pass the resulting document(s) straight into the existing EJS views (`articles/list.ejs`, `articles/details.ejs`) - no changes were needed in the views themselves, since Mongoose documents expose the same field names the views already used. Express 5 automatically forwards a rejected promise from an `async` route handler to `errorHandler` (`src/middlewares/errorHandler.js`), so a database error (e.g. a dropped connection) still results in a proper `500` response instead of an unhandled rejection.

```bash
# List and detail pages now come from MongoDB Atlas
curl http://localhost:3000/articles
curl http://localhost:3000/articles/2
curl http://localhost:3000/articles/999   # 404 - no article with this id in the collection
```

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

## Passport Authentication and Sessions

Authentication is handled by [Passport](https://www.passportjs.org/) with the [`passport-local`](https://github.com/jaredhanson/passport-local) strategy, and the resulting login state is kept server-side by [`express-session`](https://github.com/expressjs/session) - the client only holds an opaque session id, never any credentials or user data.

| Piece | File | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` / `SESSION_COOKIE_NAME` / `SESSION_COOKIE_MAX_AGE` | `src/config/session.js` | Cookie-signing secret (from `process.env.SESSION_SECRET`, with a development fallback), the session cookie's name (`sid`) and lifetime (`1h`). |
| Passport `LocalStrategy` | `src/config/passport.js` | Configured with `{ usernameField: 'email', passwordField: 'password' }` so it reads `email`/`password` from the request body instead of Passport's default `username` field. Looks the account up by email and checks the password with `bcryptjs`. |
| `serializeUser` / `deserializeUser` | `src/config/passport.js` | Only the account `id` is stored in the session; on every request Passport looks the full account back up from `id`, so the session payload stays small and always reflects the current account state. |
| `accounts` | `src/data/accounts.js` | In-memory list of registered accounts (`{ id, email, passwordHash }`), separate from the sample `users` data used by the `/users` pages. Seeded with one demo account: **email `demo@example.com`, password `demo1234`**. |
| `ensureAuthenticated` | `src/middlewares/auth.js` | Calls Passport's `req.isAuthenticated()`, which is `true` only when the incoming session cookie maps to a valid, still-logged-in session. Responds `401` otherwise; on success calls `next()` with `req.user` set to the full account. Protects `GET /users*`, `GET /auth/me` and `GET /protected`. |
| `register` / `login` / `logout` / `getCurrentUser` | `src/controllers/authController.js` | See routes below. |

Passwords are hashed with `bcryptjs` before being stored; they are never kept or returned in plain text. The full flow:

1. `POST /auth/register` creates the account, then calls Passport's `req.login()` to start a session for it immediately (no separate login step needed after registering).
2. `POST /auth/login` runs `passport.authenticate('local', ...)`, which invokes the `LocalStrategy` above; on success it also calls `req.login()` to start the session.
3. `req.login()` regenerates the session and stores the serialized account id in it; `express-session` then sets a `Set-Cookie: sid=...` header with `httpOnly: true` (not readable from client-side JavaScript) and `secure` (only sent over HTTPS - see the note below on running behind TLS in production).
4. Every subsequent request that carries that cookie is deserialized back into `req.user` by `passport.session()`, so `ensureAuthenticated` and the controllers can rely on it.
5. `POST /auth/logout` calls Passport's `req.logout()`, which clears the login state from the session.

> **Note on the `secure` cookie flag:** this project sets `secure: process.env.NODE_ENV === 'production'`. A `secure` cookie is only ever sent by the browser over HTTPS, so hardcoding `secure: true` would silently break every session cookie while developing locally over plain HTTP. Set `NODE_ENV=production` (and serve the app over HTTPS, e.g. behind a reverse proxy) to enable it.

### Auth routes (`src/routes/authRoutes.js`, mounted at `/auth`)

| Method | Path | Auth required | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | `{ "email", "password" }` | `201` + `{ message, user }`, starts a session and sets the `sid` cookie. `400` if fields are missing, `409` if the email is already registered. |
| POST | `/auth/login` | No | `{ "email", "password" }` | `200` + `{ message, user }`, starts a session and sets the `sid` cookie. `400` if fields are missing, `401` if the credentials are invalid. |
| POST | `/auth/logout` | No | — | `200` + `{ message }`, ends the session server-side. |
| GET | `/auth/me` | **Yes (session)** | — | `200` + `{ user }` for the logged-in account. `401` if not authenticated. |

```bash
# Register a new account (also logs it in - cookie saved to jar for reuse)
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"alice123"}' http://localhost:3000/auth/register

# Log in with the seeded demo account
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}' http://localhost:3000/auth/login

# Check who the session belongs to
curl -b cookies.txt http://localhost:3000/auth/me

# Access the protected route
curl -b cookies.txt http://localhost:3000/protected

# Log out (ends the session server-side)
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout

# The protected route now rejects the same (logged-out) cookie
curl -i -b cookies.txt http://localhost:3000/protected   # 401
```

## Middlewares

### Global middlewares (applied to every request, in `src/app.js`)

| Middleware | File | Purpose |
| --- | --- | --- |
| `requestLogger` | `src/middlewares/logger.js` | Logs the timestamp, HTTP method and URL of every incoming request to the console. |
| `cookieParser` | `cookie-parser` package | Parses cookies from the request header into `req.cookies` (used by `themeLoader`). |
| `express.json` / `express.urlencoded` | Express built-ins | Parse JSON bodies (used by `/auth/*`) and URL-encoded form bodies (used by `/theme`). |
| `session` | `express-session` package, configured in `src/config/session.js` | Loads/creates the session for the incoming `sid` cookie and exposes it as `req.session`. See [Passport Authentication and Sessions](#passport-authentication-and-sessions). |
| `passport.initialize()` / `passport.session()` | `passport` package, configured in `src/config/passport.js` | Wires Passport into the request pipeline and reads the logged-in account out of `req.session` into `req.user` on every request. |
| `express.static` | Express built-in | Serves `src/public/` (CSS and `favicon.ico`). |
| `themeLoader` | `src/middlewares/theme.js` | Reads the `theme` cookie into `res.locals.theme` for every view render. |
| `notFoundHandler` | `src/middlewares/errorHandler.js` | Runs after all routes; returns a plain-text `404` for any URL that doesn't match a defined route. |
| `errorHandler` | `src/middlewares/errorHandler.js` | Centralized 4-argument Express error handler. Logs the error, returns `400` for malformed JSON bodies, and `500` (or `err.statusCode`) for anything else. |

### `/users` and `/users/:userId` middlewares (`src/routes/usersRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `ensureAuthenticated` | `src/middlewares/auth.js` | All `/users` routes | Requires a valid, logged-in Passport session (`req.isAuthenticated()`). Responds `401` if there is none, otherwise attaches the account to `req.user` and calls `next()`. |
| `validateUserId` | `src/middlewares/validateUser.js` | Routes with `:userId` (`GET/PUT/DELETE /users/:userId`) | Responds `400` unless `userId` is a numeric string. |
| `validateUserInput` | `src/middlewares/validateUser.js` | `POST /users`, `PUT /users/:userId` | Responds `400` unless the request body contains both `username` and `password`. |

### `/articles` and `/articles/:articleId` middlewares (`src/routes/articlesRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `checkArticleAccess` | `src/middlewares/articleAccess.js` | All `/articles` routes | Reads the `x-role` request header (defaults to `guest`). `GET` requests are allowed for any role; `POST`/`PUT`/`DELETE` require role `admin` or `editor`, otherwise responds `403`. |
| `validateArticleId` | `src/middlewares/articleAccess.js` | Routes with `:articleId` (`GET/PUT/DELETE /articles/:articleId`) | Responds `400` unless `articleId` is a numeric string. |

### `/protected` middlewares (`src/routes/protectedRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `ensureAuthenticated` | `src/middlewares/auth.js` | `GET /protected` | Same session check as above - `401` without a valid logged-in session. |

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

See [Passport Authentication and Sessions](#passport-authentication-and-sessions) above for the full table.

### Protected

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/protected` | auth (Passport session) | `200` + `{ message, user }` for a logged-in session. `401` otherwise. |

### Users

Requires a valid, logged-in Passport session (see [Passport Authentication and Sessions](#passport-authentication-and-sessions)) on every request. Sample data comes from `src/data/users.js` (ids `1`–`4`).

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/users` | auth (session) | HTML page (PUG) — list of users |
| POST | `/users` | auth (session), validate body | `Post users route` |
| GET | `/users/:userId` | auth (session), validate id | HTML page (PUG) — user details, or a `404` HTML page if the id is unknown |
| PUT | `/users/:userId` | auth (session), validate id, validate body | `Put user by Id route: {userId}` |
| DELETE | `/users/:userId` | auth (session), validate id | `Delete user by Id route: {userId}` |

### Articles

Optionally send header `x-role: admin` or `x-role: editor` to perform write operations (`POST`/`PUT`/`DELETE`); reads (`GET`) work for any role, including no header at all (defaults to `guest`). `GET` routes read from the MongoDB Atlas `articles` collection (ids `1`–`3`, seeded via `npm run seed` from `src/data/articles.js` - see [MongoDB Atlas Integration](#mongodb-atlas-integration)); `POST`/`PUT`/`DELETE` remain unimplemented stubs.

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

# Auth - register, login, check identity, access the protected route, logout
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}' http://localhost:3000/auth/login
curl -b cookies.txt http://localhost:3000/auth/me
curl -b cookies.txt http://localhost:3000/protected
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout

# Users - requires a logged-in Passport session. Log in first and reuse the cookie jar.
curl -c cookies.txt -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}' http://localhost:3000/auth/login
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
curl http://localhost:3000/users                                    # 401 - no session
curl http://localhost:3000/protected                                # 401 - no session
curl -b cookies.txt http://localhost:3000/users/abc                 # 400 - invalid userId
curl -b cookies.txt http://localhost:3000/users/999                 # 404 - HTML "not found" page (PUG)
curl http://localhost:3000/articles/999                             # 404 - HTML "not found" page (EJS)
curl -X POST http://localhost:3000/articles                         # 403 - guest role can't write
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"wrong"}' http://localhost:3000/auth/login  # 401 - bad credentials
curl -i -X POST -d "theme=neon" http://localhost:3000/theme         # 400 - invalid theme value
curl http://localhost:3000/some/unknown/path                        # 404 - unknown route
curl -X POST -H "Content-Type: application/json" -d '{invalid-json' \
  http://localhost:3000/auth/login                                  # 400 - malformed JSON, caught by errorHandler
```

## Package Manager

This project uses **npm** for dependency management (`package.json` / `package-lock.json`).
