# hw61-express-middleware

A **Node.js** and **Express.js** RESTful API server, built on the **MVC (Model-View-Controller)** architectural pattern and extended with a set of middlewares for logging, session management, authentication, data validation, access control and centralized error handling. All server responses remain plain text.

## Project Structure

```
hw61-express-middleware/
├── index.js                     # Entry point - starts the server on port 3000
├── src/
│   ├── app.js                   # Express app setup and middleware wiring
│   ├── controllers/             # Request handling logic (the "C" in MVC)
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   ├── middlewares/              # Cross-cutting request processing logic
│   │   ├── logger.js             # Request logging
│   │   ├── session.js            # Session management
│   │   ├── auth.js               # Authentication (users routes)
│   │   ├── validateUser.js       # Validation for user data/params
│   │   ├── articleAccess.js      # Access control + validation for articles
│   │   └── errorHandler.js       # 404 and centralized error handling
│   └── routes/                   # Route definitions, mapped to controllers + middlewares
│       ├── index.js              # Aggregates all route modules
│       ├── rootRoutes.js
│       ├── usersRoutes.js
│       └── articlesRoutes.js
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

## Middlewares

### Global middlewares (applied to every request, in `src/app.js`)

| Middleware | File | Purpose |
| --- | --- | --- |
| `requestLogger` | `src/middlewares/logger.js` | Logs the timestamp, HTTP method and URL of every incoming request to the console. Covers `/` and every other route, satisfying the "request tracking" requirement. |
| `sessionManager` | `src/middlewares/session.js` | Reads the `X-Session-Id` request header. If it is missing or unknown, generates a new session id and stores basic session data (creation time, request count, last access time) in an in-memory store. Attaches the session to `req.session` / `req.sessionId` and echoes the id back via the `X-Session-Id` response header, so a client can reuse it on subsequent requests. |
| `notFoundHandler` | `src/middlewares/errorHandler.js` | Runs after all routes; returns a plain-text `404` for any URL that doesn't match a defined route. |
| `errorHandler` | `src/middlewares/errorHandler.js` | Centralized 4-argument Express error handler. Logs the error, returns `400` for malformed JSON bodies (e.g. thrown by `express.json()`), and `500` (or `err.statusCode`) for anything else. |

### `/users` and `/users/:userId` middlewares (`src/routes/usersRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `authenticate` | `src/middlewares/auth.js` | All `/users` routes | Requires an `Authorization: Bearer <token>` header. Responds `401` if it is missing or empty, otherwise attaches `req.user` and calls `next()`. |
| `validateUserId` | `src/middlewares/validateUser.js` | Routes with `:userId` (`GET/PUT/DELETE /users/:userId`) | Responds `400` unless `userId` is a numeric string. |
| `validateUserInput` | `src/middlewares/validateUser.js` | `POST /users`, `PUT /users/:userId` | Responds `400` unless the request body contains both `username` and `password`. |

### `/articles` and `/articles/:articleId` middlewares (`src/routes/articlesRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `checkArticleAccess` | `src/middlewares/articleAccess.js` | All `/articles` routes | Reads the `x-role` request header (defaults to `guest`). `GET` requests are allowed for any role; `POST`/`PUT`/`DELETE` require role `admin` or `editor`, otherwise responds `403`. |
| `validateArticleId` | `src/middlewares/articleAccess.js` | Routes with `:articleId` (`GET/PUT/DELETE /articles/:articleId`) | Responds `400` unless `articleId` is a numeric string. |

## API Routes

All responses are returned as plain text.

### Root

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/` | logging, session | `Get root route` |

### Users

Requires header `Authorization: Bearer <any-non-empty-token>` on every request.

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/users` | auth | `Get users route` |
| POST | `/users` | auth, validate body | `Post users route` |
| GET | `/users/:userId` | auth, validate id | `Get user by Id route: {userId}` |
| PUT | `/users/:userId` | auth, validate id, validate body | `Put user by Id route: {userId}` |
| DELETE | `/users/:userId` | auth, validate id | `Delete user by Id route: {userId}` |

### Articles

Optionally send header `x-role: admin` or `x-role: editor` to perform write operations (`POST`/`PUT`/`DELETE`); reads (`GET`) work for any role, including no header at all (defaults to `guest`).

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/articles` | access control | `Get articles route` |
| POST | `/articles` | access control (admin/editor only) | `Post articles route` |
| GET | `/articles/:articleId` | access control, validate id | `Get article by Id route: {articleId}` |
| PUT | `/articles/:articleId` | access control (admin/editor only), validate id | `Put article by Id route: {articleId}` |
| DELETE | `/articles/:articleId` | access control (admin/editor only), validate id | `Delete article by Id route: {articleId}` |

### Example requests

```bash
# Root
curl http://localhost:3000/

# Users - requires Authorization header
curl -H "Authorization: Bearer testtoken" http://localhost:3000/users
curl -X POST -H "Authorization: Bearer testtoken" -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret"}' http://localhost:3000/users
curl -H "Authorization: Bearer testtoken" http://localhost:3000/users/42
curl -X PUT -H "Authorization: Bearer testtoken" -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret"}' http://localhost:3000/users/42
curl -X DELETE -H "Authorization: Bearer testtoken" http://localhost:3000/users/42

# Articles - GET works without any role header, writes need admin/editor
curl http://localhost:3000/articles
curl -X POST -H "x-role: editor" http://localhost:3000/articles
curl http://localhost:3000/articles/7
curl -X PUT -H "x-role: admin" http://localhost:3000/articles/7
curl -X DELETE -H "x-role: admin" http://localhost:3000/articles/7

# Error cases
curl http://localhost:3000/users                              # 401 - no Authorization header
curl -H "Authorization: Bearer testtoken" http://localhost:3000/users/abc   # 400 - invalid userId
curl -X POST http://localhost:3000/articles                    # 403 - guest role can't write
curl http://localhost:3000/some/unknown/path                   # 404 - unknown route
curl -X POST -H "Authorization: Bearer testtoken" -H "Content-Type: application/json" \
  -d '{invalid-json' http://localhost:3000/users               # 400 - malformed JSON, caught by errorHandler
```

## Package Manager

This project uses **npm** for dependency management (`package.json` / `package-lock.json`).
