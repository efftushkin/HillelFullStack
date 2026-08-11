# hw60-express-restful

A simple RESTful API server built with **Node.js** and **Express.js**, following the **MVC (Model-View-Controller)** architectural pattern. The server responds with plain text messages for easy debugging and integration testing.

## Project Structure

```
hw60-express-restful/
├── index.js                     # Entry point - starts the server on port 3000
├── src/
│   ├── app.js                   # Express app setup and middleware
│   ├── controllers/             # Request handling logic (the "C" in MVC)
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   └── routes/                  # Route definitions, mapped to controllers
│       ├── index.js             # Aggregates all route modules
│       ├── rootRoutes.js
│       ├── usersRoutes.js
│       └── articlesRoutes.js
├── package.json
└── README.md
```

Controllers contain the logic for handling each request, while route modules only define which controller function handles which HTTP method and path. This keeps request-handling logic isolated and easy to extend (e.g. adding a `models/` directory for database integration in the future).

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

The server will listen on port **3000**. You should see:

```
Server is running on http://localhost:3000
```

You can then send requests to `http://localhost:3000` using a browser, `curl`, or a tool like Postman.

## API Routes

All responses are returned as plain text.

### Root

| Method | Path | Response |
| --- | --- | --- |
| GET | `/` | `Get root route` |

### Users

| Method | Path | Response |
| --- | --- | --- |
| GET | `/users` | `Get users route` |
| POST | `/users` | `Post users route` |
| GET | `/users/:userId` | `Get user by Id route: {userId}` |
| PUT | `/users/:userId` | `Put user by Id route: {userId}` |
| DELETE | `/users/:userId` | `Delete user by Id route: {userId}` |

### Articles

| Method | Path | Response |
| --- | --- | --- |
| GET | `/articles` | `Get articles route` |
| POST | `/articles` | `Post articles route` |
| GET | `/articles/:articleId` | `Get article by Id route: {articleId}` |
| PUT | `/articles/:articleId` | `Put article by Id route: {articleId}` |
| DELETE | `/articles/:articleId` | `Delete article by Id route: {articleId}` |

### Example requests

```bash
curl http://localhost:3000/
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users
curl http://localhost:3000/users/42
curl -X PUT http://localhost:3000/users/42
curl -X DELETE http://localhost:3000/users/42

curl http://localhost:3000/articles
curl -X POST http://localhost:3000/articles
curl http://localhost:3000/articles/7
curl -X PUT http://localhost:3000/articles/7
curl -X DELETE http://localhost:3000/articles/7
```

## Package Manager

This project uses **npm** for dependency management (`package.json` / `package-lock.json`).
