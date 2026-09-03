# hw66-express-mongodb-write

A **Node.js** and **Express.js** RESTful API server, built on the **MVC (Model-View-Controller)** architectural pattern. It extends the previous homework (`hw65-express-mongodb`), which only *read* the `articles` collection from **MongoDB Atlas**, by adding full **create / update / delete** support on top of it, via **Mongoose**:

- a shared **favicon** served on every HTML page (PUG and EJS alike);
- a **theme preference** (light/dark) persisted in a cookie via `cookie-parser`;
- **Passport-based authentication** — a `passport-local` strategy validates an email/password pair, and `express-session` persists the resulting login state server-side, identified by a session id stored in an `httpOnly` cookie;
- a **protected route** (`GET /protected`), plus the pre-existing `GET /users*` routes and `GET /auth/me`, all guarded by a Passport-session middleware that only lets a request through when it carries a valid, logged-in session;
- a **MongoDB Atlas connection** (via [Mongoose](https://mongoosejs.com/)), with the `GET /articles` and `GET /articles/:articleId` pages reading their data from a real `articles` collection in the database instead of an in-memory array;
- **new in this homework** - full write support on the `articles` collection: `insertOne` / `insertMany` (create), `updateOne` / `updateMany` / `replaceOne` (update), `deleteOne` / `deleteMany` (delete), plus an extended read endpoint using `find()` with a **projection**. See [MongoDB Atlas Integration](#mongodb-atlas-integration) for the full breakdown.

The `GET /users`, `GET /users/:userId`, `GET /articles` and `GET /articles/:articleId` pages are rendered as HTML using template engines — **PUG** for users, **EJS** for articles. Every other route, including all the new `/articles` write routes and the `/articles/search` read route, exchanges **JSON**.

## Project Structure

```
hw66-express-mongodb-write/
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
│   │   ├── articlesController.js   # GET /articles* (EJS + find/projection) and all the write routes below - see MongoDB Atlas Integration
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
│   │   ├── articleAccess.js        # Access control (role check) + :articleId validation for articles
│   │   ├── validateArticleBody.js  # NEW - request body validation for every articles write route
│   │   └── errorHandler.js         # 404 and centralized error handling (incl. Mongoose validation/cast/duplicate-key errors)
│   ├── routes/                     # Route definitions, mapped to controllers + middlewares
│   │   ├── index.js                # Aggregates all route modules
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   ├── articlesRoutes.js       # Now includes insertOne/insertMany/updateOne/updateMany/replaceOne/deleteOne/deleteMany routes
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
   MONGODB_DB_NAME="hw66-express-mongodb-write"
   ```

   - `MONGODB_URI` is the Atlas SRV connection string (from **Atlas → Connect → Drivers**), including your database user's username and password.
   - `MONGODB_DB_NAME` is the database name Mongoose connects to (created automatically on first write if it doesn't exist yet). This homework uses its own database (`hw66-express-mongodb-write`), separate from `hw65-express-mongodb`, so that testing the new write routes (especially `insertMany`/`updateMany`/`deleteMany`) never touches the previous homework's data.
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
Connected to MongoDB Atlas (database: hw66-express-mongodb-write)
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

The server is connected to a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster using [Mongoose](https://mongoosejs.com/), MongoDB's Object Data Modeling (ODM) library for Node.js. The `articles` collection replaces the in-memory `src/data/articles.js` array as the data source for every `/articles` route - both the two HTML read pages carried over from `hw65-express-mongodb` and the JSON write/search routes added in this homework.

| Piece | File | Purpose |
| --- | --- | --- |
| `.env` | project root (git-ignored) | Holds `MONGODB_URI` (the Atlas SRV connection string) and `MONGODB_DB_NAME`. Loaded via [`dotenv`](https://github.com/motdotla/dotenv) at the top of `index.js`. Based on `.env.example`, which documents the required variables without real credentials. |
| `connectDB()` | `src/config/db.js` | Opens the Mongoose connection with `mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })`. Throws a clear error if `MONGODB_URI` is missing. |
| `Article` model | `src/models/Article.js` | Mongoose schema for one article document: `id` (Number, unique), `title`, `author`, `publishedAt`, `content` (all String, required). The numeric `id` field (not Mongo's `_id`) keeps it compatible with the existing `:articleId` routes and `validateArticleId` middleware, which only accept a plain numeric string. |
| `seedArticles.js` | `src/scripts/seedArticles.js`, run via `npm run seed` | Connects to the database and upserts each article from `src/data/articles.js` into the `articles` collection, matched by `id`. Safe to run multiple times - it updates existing articles instead of duplicating them. |

**Startup sequence** (`index.js`): `dotenv` loads `.env` → `connectDB()` establishes the Mongoose connection → only once that succeeds does `app.listen()` start accepting HTTP requests. This avoids serving requests that would otherwise fail because the database isn't reachable yet.

Every handler below is an `async` function that calls a method directly on the `Article` Mongoose model. Mongoose's `Model.insertOne` / `insertMany` / `updateOne` / `updateMany` / `replaceOne` / `deleteOne` / `deleteMany` are thin wrappers around the identically-named methods of the underlying MongoDB Node.js driver `Collection` - they accept the same filter/update documents and return the same `{ acknowledged, matchedCount, modifiedCount, ... }` / `{ acknowledged, deletedCount }` results, while still applying the `Article` schema's casting and validation. Express 5 automatically forwards a rejected promise from an `async` route handler to `errorHandler` (`src/middlewares/errorHandler.js`), so a database error (a validation failure, a bad cast, a dropped connection) still results in a proper JSON error response instead of an unhandled rejection.

All new write routes require the `x-role: admin` or `x-role: editor` header, exactly like the pre-existing `POST`/`PUT`/`DELETE` article routes (see `checkArticleAccess`, under [Middlewares](#middlewares) below) - `PATCH` was added to the set of methods it guards.

### Read: `find()` with a projection

| Method | Path | Middlewares | Purpose |
| --- | --- | --- | --- |
| GET | `/articles` | access control | HTML page (EJS) — unchanged from `hw65-express-mongodb`, still `Article.find().sort({ id: 1 })`. |
| GET | `/articles/:articleId` | access control, validate id | HTML page (EJS) — unchanged, still `Article.findOne({ id })`. |
| GET | `/articles/search` | access control | **New.** JSON list, built on `Article.find(filter, projection)`. |

`GET /articles/search` (`searchArticles` in `articlesController.js`) accepts three optional query parameters:

- `author` - case-insensitive substring filter (`{ author: /value/i }`).
- `id` - exact numeric filter (`{ id: Number(value) }`); `400` if it isn't a number.
- `fields` - a comma-separated **projection**, passed as the second argument to `find()`. `fields=title,author` returns only those fields (inclusion); `fields=-content` returns everything *except* `content` (exclusion). Mixing inclusion and exclusion in the same request is rejected with `400`, same as MongoDB itself would reject it. `_id` is always dropped from the response.

```js
const searchArticles = async (req, res) => {
  const { author, id, fields } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(escapeRegExp(author), 'i');
  if (id !== undefined) filter.id = Number(id); // 400 first if NaN
  const { projection } = buildProjection(fields); // { _id: 0, title: 1, author: 1 }, etc.
  const articles = await Article.find(filter, projection).sort({ id: 1 });
  res.json({ count: articles.length, articles });
};
```

```bash
curl "http://localhost:3000/articles/search"                              # find(), no filter/projection
curl "http://localhost:3000/articles/search?fields=title,author"          # find(filter, { title: 1, author: 1, _id: 0 })
curl "http://localhost:3000/articles/search?fields=-content"              # find(filter, { content: 0, _id: 0 })
curl "http://localhost:3000/articles/search?author=jane&fields=title"     # find({ author: /jane/i }, { title: 1, _id: 0 })
curl "http://localhost:3000/articles/search?fields=title,-content"        # 400 - mixed inclusion/exclusion
```

Expected response for `GET /articles/search?fields=title,author`:

```json
{
  "count": 3,
  "articles": [
    { "title": "Getting Started with Express.js", "author": "John Doe" },
    { "title": "Understanding Middleware in Express", "author": "Jane Smith" },
    { "title": "Templating with PUG and EJS", "author": "Mike Wilson" }
  ]
}
```

### Create: `insertOne()` and `insertMany()`

| Method | Path | Middlewares | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/articles` | access control (admin/editor), validate body | `{ "title", "author", "publishedAt", "content" }` | `201` + `{ message, article }` |
| POST | `/articles/many` | access control (admin/editor), validate body | A JSON array of the same shape | `201` + `{ message, articles }` |

Both handlers use `Article.insertOne(doc)` / `Article.insertMany(docs)` directly - Mongoose's `insertOne` builds a document and calls `.save()` on it (so it's validated against the schema), and `insertMany` does the same for every item in the array. The numeric `id` is always **assigned by the server**, not taken from the request body: `getNextArticleId()` reads the current highest `id` in the collection (`Article.findOne().sort({ id: -1 })`) and increments it, so newly-created articles keep working with the existing `:articleId` routes without any risk of a duplicate-key clash.

```js
const createArticle = async (req, res) => {
  const { title, author, publishedAt, content } = req.body;
  const id = await getNextArticleId();
  const article = await Article.insertOne({ id, title, author, publishedAt, content });
  res.status(201).json({ message: 'Article created', article });
};
```

```bash
# insertOne
curl -X POST -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Deploying Node.js Apps","author":"Alice Wong","publishedAt":"2024-06-01","content":"A guide to deploying Node apps."}' \
  http://localhost:3000/articles

# insertMany
curl -X POST -H "Content-Type: application/json" -H "x-role: editor" \
  -d '[{"title":"CSS Grid Basics","author":"Bob Lee","publishedAt":"2024-06-05","content":"Intro to CSS Grid."},{"title":"Flexbox 101","author":"Bob Lee","publishedAt":"2024-06-06","content":"Intro to Flexbox."}]' \
  http://localhost:3000/articles/many
```

Expected response for the `insertOne` request above (`id` is auto-assigned to the next free number, `4` on a freshly-seeded database):

```json
{
  "message": "Article created",
  "article": {
    "id": 4,
    "title": "Deploying Node.js Apps",
    "author": "Alice Wong",
    "publishedAt": "2024-06-01",
    "content": "A guide to deploying Node apps.",
    "_id": "6a989aa786220cb1221ebcc6"
  }
}
```

Expected response for the `insertMany` request above (ids `5` and `6` follow on from the `insertOne` call):

```json
{
  "message": "2 article(s) created",
  "articles": [
    { "id": 5, "title": "CSS Grid Basics", "author": "Bob Lee", "publishedAt": "2024-06-05", "content": "Intro to CSS Grid.", "_id": "6a989aa786220cb1221ebcc7" },
    { "id": 6, "title": "Flexbox 101", "author": "Bob Lee", "publishedAt": "2024-06-06", "content": "Intro to Flexbox.", "_id": "6a989aa786220cb1221ebcc8" }
  ]
}
```

`validateArticlePayload` / `validateArticlesPayload` (`src/middlewares/validateArticleBody.js`) reject a request with `400` before it reaches MongoDB if any required field is missing, empty, or not a string (or if the `/many` body isn't a non-empty array):

```bash
curl -i -X POST -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Missing stuff"}' http://localhost:3000/articles
# 400 {"message":"Missing or invalid required field(s): author, publishedAt, content"}
```

### Update: `updateOne()`, `updateMany()` and `replaceOne()`

| Method | Path | Middlewares | Body | Response |
| --- | --- | --- | --- | --- |
| PATCH | `/articles/:articleId` | access control, validate id, validate body | Any subset of `{ title, author, publishedAt, content }` | `200` + `{ message, article }`, or `404` |
| PATCH | `/articles` | access control, validate body | `{ "filter": {...}, "update": {...} }` | `200` + `{ message, matchedCount, modifiedCount }` |
| PUT | `/articles/:articleId` | access control, validate id, validate body | Full `{ "title", "author", "publishedAt", "content" }` | `200` + `{ message, article }`, or `404` |

`PATCH /articles/:articleId` (`updateArticleById`) is a partial update - it runs `Article.updateOne({ id }, { $set: updates })`, so only the fields present in the body are changed and everything else on the document is left untouched. `PUT /articles/:articleId` (`replaceArticleById`) is a full replacement - it runs `Article.replaceOne({ id }, { id, title, author, publishedAt, content })`, so the *entire* document is swapped out for a new one (only the numeric `id` is carried over from the URL, never from the body, so the article keeps its identity). Both re-fetch the document with `findOne` after the write so the response shows the actual state in the database, and both return `404` when `matchedCount` is `0` (no article with that id).

`PATCH /articles` (`updateArticles`) is the bulk case - it applies `Article.updateMany(filter, { $set: update })`, where both `filter` (which documents to touch) and `update` (which fields to `$set` on all of them) come straight from the request body.

```js
// updateOne
const result = await Article.updateOne({ id }, { $set: updates });
// updateMany
const result = await Article.updateMany(filter, { $set: update });
// replaceOne
const result = await Article.replaceOne({ id }, { id, title, author, publishedAt, content });
```

```bash
# updateOne - change just the title of article id 4
curl -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Deploying Node.js Apps to Production"}' http://localhost:3000/articles/4

# updateMany - rename every article by "Bob Lee" (both id 5 and id 6, inserted
# by the insertMany example above) to "Robert Lee"
curl -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"filter":{"author":"Bob Lee"},"update":{"author":"Robert Lee"}}' http://localhost:3000/articles

# replaceOne - swap the whole document for article id 5
curl -X PUT -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"CSS Grid Fundamentals","author":"Bob A. Lee","publishedAt":"2024-06-05","content":"Fully rewritten intro to CSS Grid."}' \
  http://localhost:3000/articles/5
```

Expected response for the `updateOne` request above:

```json
{
  "message": "Article updated",
  "article": {
    "_id": "6a989aa786220cb1221ebcc6",
    "id": 4,
    "title": "Deploying Node.js Apps to Production",
    "author": "Alice Wong",
    "publishedAt": "2024-06-01",
    "content": "A guide to deploying Node apps."
  }
}
```

Expected response for the `updateMany` request above (both id 5 and id 6 match `author: "Bob Lee"`):

```json
{ "message": "Articles updated", "matchedCount": 2, "modifiedCount": 2 }
```

Expected response for the `replaceOne` request above - the whole document for id 5 is now this and nothing else (no leftover fields from before the replacement):

```json
{
  "message": "Article replaced",
  "article": {
    "_id": "6a989aa786220cb1221ebcc7",
    "id": 5,
    "title": "CSS Grid Fundamentals",
    "author": "Bob A. Lee",
    "publishedAt": "2024-06-05",
    "content": "Fully rewritten intro to CSS Grid."
  }
}
```

`replaceOne` overwrote id 5's `author` back to `"Bob A. Lee"`, so only id 6 is left with `author: "Robert Lee"` - which is exactly the article the `deleteMany` example in the next section removes.

`validatePartialArticlePayload` rejects an empty body or an unknown field with `400`; `validateBulkUpdatePayload` rejects a `PATCH /articles` body unless both `filter` and `update` are non-empty objects. Updating (or replacing) an id that doesn't exist returns `404`:

```bash
curl -i -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"x"}' http://localhost:3000/articles/999
# 404 {"message":"Article with id 999 not found"}
```

### Delete: `deleteOne()` and `deleteMany()`

| Method | Path | Middlewares | Body | Response |
| --- | --- | --- | --- | --- |
| DELETE | `/articles/:articleId` | access control, validate id | — | `200` + `{ message }`, or `404` |
| DELETE | `/articles` | access control, validate body | `{ "filter": {...} }` | `200` + `{ message, deletedCount }` |

```js
// deleteOne
const result = await Article.deleteOne({ id: Number(articleId) });
// deleteMany
const result = await Article.deleteMany(filter);
```

```bash
# deleteOne
curl -X DELETE -H "x-role: admin" http://localhost:3000/articles/4
# {"message":"Article with id 4 deleted"}

# deleteMany - remove every article by "Robert Lee"
curl -X DELETE -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"filter":{"author":"Robert Lee"}}' http://localhost:3000/articles
# {"message":"Articles deleted","deletedCount":1}
```

`DELETE /articles` refuses an empty or missing `filter` with `400` (`validateBulkDeletePayload`), specifically so a call with no body can't accidentally wipe out the entire `articles` collection:

```bash
curl -i -X DELETE -H "Content-Type: application/json" -H "x-role: admin" -d '{}' http://localhost:3000/articles
# 400 {"message":"Request body must contain a non-empty \"filter\" object to avoid deleting the entire collection."}
```

`DELETE /articles/:articleId` returns `404` when nothing matches the id:

```bash
curl -i -X DELETE -H "x-role: admin" http://localhost:3000/articles/999
# 404 {"message":"Article with id 999 not found"}
```

### Errors surfaced from MongoDB/Mongoose

`errorHandler.js` was extended to turn the errors these new write routes can raise into proper JSON responses instead of a generic `500`:

| Error | Cause | Response |
| --- | --- | --- |
| `ValidationError` | A required schema field is missing/invalid at the database layer (defense-in-depth behind the body-validation middlewares) | `400` + `{ message: "Invalid data: ..." }` |
| `CastError` | A field couldn't be cast to its schema type (e.g. a non-numeric `id` reaching a query) | `400` + `{ message: "Invalid data: ..." }` |
| Duplicate key (`code 11000`) | An `insertOne`/`insertMany` collided with the unique `id` index | `409` + `{ message: "Duplicate key error.", detail: ... }` |

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
| `errorHandler` | `src/middlewares/errorHandler.js` | Centralized 4-argument Express error handler. Logs the error, returns `400` for malformed JSON bodies or a Mongoose `ValidationError`/`CastError`, `409` for a MongoDB duplicate-key error, and `500` (or `err.statusCode`) for anything else. See [Errors surfaced from MongoDB/Mongoose](#errors-surfaced-from-mongodbmongoose). |

### `/users` and `/users/:userId` middlewares (`src/routes/usersRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `ensureAuthenticated` | `src/middlewares/auth.js` | All `/users` routes | Requires a valid, logged-in Passport session (`req.isAuthenticated()`). Responds `401` if there is none, otherwise attaches the account to `req.user` and calls `next()`. |
| `validateUserId` | `src/middlewares/validateUser.js` | Routes with `:userId` (`GET/PUT/DELETE /users/:userId`) | Responds `400` unless `userId` is a numeric string. |
| `validateUserInput` | `src/middlewares/validateUser.js` | `POST /users`, `PUT /users/:userId` | Responds `400` unless the request body contains both `username` and `password`. |

### `/articles` and `/articles/:articleId` middlewares (`src/routes/articlesRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `checkArticleAccess` | `src/middlewares/articleAccess.js` | All `/articles` routes | Reads the `x-role` request header (defaults to `guest`). `GET` requests are allowed for any role; `POST`/`PUT`/`PATCH`/`DELETE` require role `admin` or `editor`, otherwise responds `403`. |
| `validateArticleId` | `src/middlewares/articleAccess.js` | Routes with `:articleId` (`GET/PUT/PATCH/DELETE /articles/:articleId`) | Responds `400` unless `articleId` is a numeric string. |
| `validateArticlePayload` | `src/middlewares/validateArticleBody.js` | `POST /articles` (insertOne), `PUT /articles/:articleId` (replaceOne) | Responds `400` unless `title`, `author`, `publishedAt` and `content` are all present, non-empty strings. |
| `validateArticlesPayload` | `src/middlewares/validateArticleBody.js` | `POST /articles/many` (insertMany) | Responds `400` unless the body is a non-empty array where every item passes the same field check as above. |
| `validatePartialArticlePayload` | `src/middlewares/validateArticleBody.js` | `PATCH /articles/:articleId` (updateOne) | Responds `400` if the body is empty or contains a field outside `{ title, author, publishedAt, content, id }`. |
| `validateBulkUpdatePayload` | `src/middlewares/validateArticleBody.js` | `PATCH /articles` (updateMany) | Responds `400` unless the body has both a non-empty `filter` object and a non-empty `update` object. |
| `validateBulkDeletePayload` | `src/middlewares/validateArticleBody.js` | `DELETE /articles` (deleteMany) | Responds `400` unless the body has a non-empty `filter` object, so a missing filter can't wipe the whole collection. |

### `/protected` middlewares (`src/routes/protectedRoutes.js`)

| Middleware | File | Applied to | Purpose |
| --- | --- | --- | --- |
| `ensureAuthenticated` | `src/middlewares/auth.js` | `GET /protected` | Same session check as above - `401` without a valid logged-in session. |

## API Routes

`GET /users`, `GET /users/:userId`, `GET /articles` and `GET /articles/:articleId` render **HTML** pages (PUG or EJS, see [Template Engines](#template-engines)); the `/auth` routes and every `/articles` write route (`POST`/`PUT`/`PATCH`/`DELETE`) plus `GET /articles/search` return **JSON**; the remaining `/users` write routes and the root route still return plain text.

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

Send header `x-role: admin` or `x-role: editor` to perform write operations (`POST`/`PUT`/`PATCH`/`DELETE`); reads (`GET`) work for any role, including no header at all (defaults to `guest`). Data lives in the MongoDB Atlas `articles` collection (ids `1`–`3`, seeded via `npm run seed` from `src/data/articles.js`). The two `GET` routes below render HTML (unchanged from `hw65-express-mongodb`); every write route and `GET /articles/search` exchange JSON - see [MongoDB Atlas Integration](#mongodb-atlas-integration) for the full write-up with example request/response bodies for each one.

| Method | Path | Middlewares | Response |
| --- | --- | --- | --- |
| GET | `/articles` | access control | HTML page (EJS) — list of articles (`Article.find()`) |
| GET | `/articles/search` | access control | JSON — `Article.find(filter, projection)`, filterable by `author`/`id`, `fields` query param selects/excludes fields |
| GET | `/articles/:articleId` | access control, validate id | HTML page (EJS) — article details (`Article.findOne()`), or a `404` HTML page if the id is unknown |
| POST | `/articles` | access control (admin/editor), validate body | `201` + `{ message, article }` — `Article.insertOne()`, `id` auto-assigned |
| POST | `/articles/many` | access control (admin/editor), validate body | `201` + `{ message, articles }` — `Article.insertMany()`, an array of articles |
| PUT | `/articles/:articleId` | access control (admin/editor), validate id, validate body | `200` + `{ message, article }`, or `404` — `Article.replaceOne()` |
| PATCH | `/articles/:articleId` | access control (admin/editor), validate id, validate body | `200` + `{ message, article }`, or `404` — `Article.updateOne()` |
| PATCH | `/articles` | access control (admin/editor), validate body | `200` + `{ message, matchedCount, modifiedCount }` — `Article.updateMany()`, body `{ filter, update }` |
| DELETE | `/articles/:articleId` | access control (admin/editor), validate id | `200` + `{ message }`, or `404` — `Article.deleteOne()` |
| DELETE | `/articles` | access control (admin/editor), validate body | `200` + `{ message, deletedCount }` — `Article.deleteMany()`, body `{ filter }` (required, non-empty) |

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
curl "http://localhost:3000/articles/search?fields=title,author"

# Articles - write routes need an admin/editor role. See "MongoDB Atlas
# Integration" above for the full request/response pairs for each one.
curl -X POST -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Deploying Node.js Apps","author":"Alice Wong","publishedAt":"2024-06-01","content":"A guide to deploying Node apps."}' \
  http://localhost:3000/articles
curl -X POST -H "Content-Type: application/json" -H "x-role: editor" \
  -d '[{"title":"CSS Grid Basics","author":"Bob Lee","publishedAt":"2024-06-05","content":"Intro to CSS Grid."},{"title":"Flexbox 101","author":"Bob Lee","publishedAt":"2024-06-06","content":"Intro to Flexbox."}]' \
  http://localhost:3000/articles/many
curl -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Deploying Node.js Apps to Production"}' http://localhost:3000/articles/4
curl -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"filter":{"author":"Bob Lee"},"update":{"author":"Robert Lee"}}' http://localhost:3000/articles
curl -X PUT -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"CSS Grid Fundamentals","author":"Bob A. Lee","publishedAt":"2024-06-05","content":"Fully rewritten intro to CSS Grid."}' \
  http://localhost:3000/articles/5
curl -X DELETE -H "x-role: admin" http://localhost:3000/articles/4
curl -X DELETE -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"filter":{"author":"Robert Lee"}}' http://localhost:3000/articles

# Error cases
curl http://localhost:3000/users                                    # 401 - no session
curl http://localhost:3000/protected                                # 401 - no session
curl -b cookies.txt http://localhost:3000/users/abc                 # 400 - invalid userId
curl -b cookies.txt http://localhost:3000/users/999                 # 404 - HTML "not found" page (PUG)
curl http://localhost:3000/articles/999                             # 404 - HTML "not found" page (EJS)
curl -X POST http://localhost:3000/articles                         # 403 - guest role can't write
curl -X POST -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"Missing stuff"}' http://localhost:3000/articles     # 400 - missing required fields
curl -X PATCH -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{"title":"x"}' http://localhost:3000/articles/999             # 404 - JSON "not found", no article with this id
curl -X DELETE -H "Content-Type: application/json" -H "x-role: admin" \
  -d '{}' http://localhost:3000/articles                            # 400 - deleteMany refuses an empty filter
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"wrong"}' http://localhost:3000/auth/login  # 401 - bad credentials
curl -i -X POST -d "theme=neon" http://localhost:3000/theme         # 400 - invalid theme value
curl http://localhost:3000/some/unknown/path                        # 404 - unknown route
curl -X POST -H "Content-Type: application/json" -d '{invalid-json' \
  http://localhost:3000/auth/login                                  # 400 - malformed JSON, caught by errorHandler
```

## Package Manager

This project uses **npm** for dependency management (`package.json` / `package-lock.json`).
