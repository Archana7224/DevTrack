# DevTrack – Project & Issue Tracking REST API

DevTrack is a RESTful backend application designed to manage projects and track issues efficiently. It provides secure user authentication, project management, issue assignment, filtering, and API documentation.

## Features

- **Authentication & Authorization:** User registration, login, and JWT-based authentication.
- **Project Management:** Create, view, update, and delete projects.
- **Issue Management:** Create, assign, update, view, and delete issues.
- **Issue Filtering:** Filter issues by status, priority, and type.
- **Pagination:** Paginated API responses for issue and project listings.
- **Data Validation:** Request validation using Zod.
- **Password Security:** Password hashing using bcrypt.
- **API Security:** Helmet security headers and rate limiting.
- **API Documentation:** Interactive Swagger UI documentation.

## Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Backend | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| API Documentation | Swagger UI |
| Security | Helmet, Express Rate Limit |

## Project Structure

```text
DevTrack/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   └── issue.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Issue.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── issue.routes.js
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Archana7224/DevTrack.git
cd DevTrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory using `.env.example` as a reference.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=
SEED_USER_PASSWORD=
```

Replace the placeholder values with your own configuration. Never commit your actual `.env` file.

### 4. Run the application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server runs locally at:

`http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get authenticated user profile |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | Get user's projects |
| GET | `/api/projects/:projectId` | Get project details |
| PATCH | `/api/projects/:projectId` | Update a project |
| DELETE | `/api/projects/:projectId` | Delete a project |

### Issues

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/issues` | Create an issue |
| GET | `/api/issues` | Get issues with filters |
| GET | `/api/issues/:issueId` | Get issue details |
| PATCH | `/api/issues/:issueId` | Update an issue |
| DELETE | `/api/issues/:issueId` | Delete an issue |

## Authentication

DevTrack uses JWT-based authentication.

For protected endpoints, include the access token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Obtain the token by registering or logging in.

## API Documentation

Interactive API documentation is available through Swagger UI:

`/api-docs`

## Health Check

Check whether the API server is running:

`/health`

## Database

DevTrack uses MongoDB Atlas with Mongoose for database management.

The application uses separate models for users, projects, and issues, with references between related records.

## Security

- Passwords are hashed before storage.
- Protected routes require JWT authentication.
- Project and issue access is scoped through ownership checks.
- Request payloads are validated.
- HTTP security headers and rate limiting are enabled.
- Environment secrets are excluded from version control.

## Author

**Archana Nair**

- GitHub: [Archana7224](https://github.com/Archana7224)
- Project Repository: [DevTrack](https://github.com/Archana7224/DevTrack)

---

*Built as a backend development project to demonstrate REST API design, authentication, database management, and secure application development.*
