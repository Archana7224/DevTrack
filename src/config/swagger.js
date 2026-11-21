const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "DevTrack API",
    version: "1.0.0",
    description:
      "REST API for project and issue management with JWT authentication.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Check API health",
        responses: {
          200: { description: "API is running" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        responses: {
          201: { description: "User registered" },
          400: { description: "Invalid input" },
          409: { description: "Email already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login and receive JWT",
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User profile" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/projects": {
      get: {
        summary: "List current user's projects",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Projects retrieved" },
        },
      },
      post: {
        summary: "Create a project",
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: "Project created" },
          400: { description: "Invalid input" },
        },
      },
    },
    "/api/projects/{projectId}": {
      parameters: [
        {
          name: "projectId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        summary: "Get a project",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Project retrieved" },
          404: { description: "Project not found" },
        },
      },
      patch: {
        summary: "Update a project",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Project updated" },
        },
      },
      delete: {
        summary: "Delete a project",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Project deleted" },
          409: { description: "Project still has issues" },
        },
      },
    },
    "/api/projects/{projectId}/issues": {
      post: {
        summary: "Create an issue in a project",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Issue created" },
          404: { description: "Project not found" },
        },
      },
    },
    "/api/issues": {
      get: {
        summary: "List and filter issues",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "projectId", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "priority", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "sort", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Issues retrieved" },
        },
      },
    },
    "/api/issues/{issueId}": {
      parameters: [
        {
          name: "issueId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        summary: "Get one issue",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Issue retrieved" } },
      },
      patch: {
        summary: "Update or assign an issue",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Issue updated" } },
      },
      delete: {
        summary: "Delete an issue",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Issue deleted" } },
      },
    },
  },
};

export default swaggerDocument;