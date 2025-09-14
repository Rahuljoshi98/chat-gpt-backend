# Chat-GPT Clone Backend Documentation

## 1. Project Architecture and Setup

### 1.1 Overview

This backend powers a Chat-GPT clone, providing RESTful APIs for user authentication, chat management, project organization, and AI-driven chat interactions. It is built with Node.js, Express, and MongoDB (via Mongoose), and integrates with Clerk for authentication and OpenAI for AI responses.

### 1.2 Directory Structure

```
src/
  app.js              # Express app setup and middleware
  server.js           # Entry point, DB connection, server start
  config/             # Database connection logic
  controllers/        # Route handlers for business logic
  middlewares/        # Request validation and authentication
  models/             # Mongoose schemas for all entities
  repository/         # Data access and query logic
  routes/             # API route definitions (versioned, modular)
  services/           # Business logic, AI integration, user/project/chat management
  utils/              # Common utilities, error handling, helpers

package.json          # Project metadata, scripts, dependencies
.env                  # Environment variables (not committed)
```

### 1.3 Key Dependencies

- **express**: Web framework for routing and middleware
- **mongoose**: ODM for MongoDB
- **@clerk/express**: Authentication and user management
- **@ai-sdk/openai**: OpenAI API integration for AI chat
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation and validation
- **cloudinary**: File uploads (attachments)
- **multer**: File upload middleware
- **cookie-parser**: Cookie handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **validator**: Input validation
- **nodemon**: Development auto-reload
- **prettier, husky, lint-staged**: Code formatting and pre-commit hooks

### 1.4 Environment Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file in the root directory with the following (example):
     ```env
     PORT=3001
     DB_URI=mongodb://localhost:27017/chatgpt_clone
     JWT_SECRET_KEY=your_jwt_secret
     REFRESH_TOKEN_SECRET=your_refresh_secret
     ACCESS_TOKEN_EXPIRE=1h
     REFRESH_TOKEN_EXPIRE=7d
     NODE_ENV=development
     CLERK_SECRET_KEY=your_clerk_secret
     OPENAI_API_KEY=your_openai_key
     CLOUDINARY_URL=your_cloudinary_url
     ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
   The server will start on the port specified in your `.env` file (default: 3001).

### 1.5 High-Level Architecture

- **Express App (`app.js`)**: Sets up middleware (JSON parsing, cookies, CORS, Clerk), mounts all routes, and handles errors globally.
- **Server Entry (`server.js`)**: Connects to MongoDB, then starts the Express server.
- **Routes**: All API endpoints are versioned under `/api/v1/` and organized by resource (user, auth, chat, project).
- **Controllers**: Implement business logic for each resource, calling services and formatting responses.
- **Services**: Contain core business logic, interact with repositories, and integrate with external APIs (OpenAI, Clerk).
- **Repositories**: Abstract data access and queries for each model, providing a clean interface for services.
- **Models**: Define MongoDB schemas for users, chats, interactions, projects, and attachments.
- **Middlewares**: Validate requests, authenticate users, and handle errors.
- **Utilities**: Common helpers, error classes, and response formatters.

### 1.6 Development & Contribution

- Code is formatted with Prettier and checked on commit via Husky and lint-staged.
- To format code manually:
  ```sh
  npm run format
  ```
- To add new features, create new controllers, services, and routes as needed, following the modular structure.

---

## 2. API Routing and Endpoints

### 2.1 API Versioning and Structure

All API endpoints are versioned under `/api/v1/` and grouped by resource. The main resources are:

- `/user` — User management
- `/auth` — Authentication (login/logout)
- `/chat` — Chat and interaction management
- `/project` — Project organization and chat grouping

Each resource exposes RESTful endpoints with clear request/response schemas and uses middleware for validation and authentication.

---

### 2.2 Endpoint Reference

#### 2.2.1 User Endpoints

**POST /api/v1/user**

- Create a new user (typically called after Clerk registration)
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      /* user object */
    },
    "error": {}
  }
  ```

---

#### 2.2.2 Auth Endpoints

**POST /api/v1/auth/login**

- Log in a user
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login Successfull",
    "data": {
      /* user object */
    },
    "error": {}
  }
  ```
- **Cookies Set:**
  - `accessToken` (httpOnly)
  - `refreshToken` (httpOnly)

**POST /api/v1/auth/logout**

- Log out a user (clears cookies)
- **Response:**
  ```json
  {
    "success": true,
    "message": "User logged out",
    "data": {},
    "error": {}
  }
  ```

---

#### 2.2.3 Chat Endpoints

All chat endpoints require authentication.

**POST /api/v1/chat**

- Add a new interaction (message) to a chat
- **Request Body:**
  ```json
  {
    "text": "string",
    "attachments": ["fileId1", "fileId2"],
    "chatId": "string (optional)",
    "projectId": "string (optional)",
    "model": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      /* interaction object */
    },
    "error": {}
  }
  ```

**GET /api/v1/chat**

- Get all chats for the authenticated user
- **Query Params:**
  - `page` (optional)
  - `limit` (optional)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": [ /* array of chat objects */ ],
    "meta": { "page": 1, "limit": 10, "total": 20, ... },
    "error": {}
  }
  ```

**GET /api/v1/chat/:id**

- Get chat history for a specific chat
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": [
      /* chat history */
    ],
    "error": {}
  }
  ```

**PATCH /api/v1/chat/:id**

- Update chat (e.g., title)
- **Request Body:**
  ```json
  {
    "title": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      /* updated chat object */
    },
    "error": {}
  }
  ```

**DELETE /api/v1/chat/:id**

- Delete a chat
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {},
    "error": {}
  }
  ```

---

#### 2.2.4 Project Endpoints

All project endpoints require authentication.

**POST /api/v1/project**

- Create a new project
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      /* project object */
    },
    "error": {}
  }
  ```

**GET /api/v1/project**

- Get all projects for the authenticated user
- **Query Params:**
  - `page` (optional)
  - `limit` (optional)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": [ /* array of project objects */ ],
    "meta": { "page": 1, "limit": 5, "total": 10, ... },
    "error": {}
  }
  ```

**PATCH /api/v1/project/:id**

- Update a project
- **Request Body:**
  ```json
  {
    "name": "string (optional)",
    "description": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      /* updated project object */
    },
    "error": {}
  }
  ```

**DELETE /api/v1/project/:id**

- Delete a project
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {},
    "error": {}
  }
  ```

**GET /api/v1/project/:id**

- Get all chats for a specific project
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully completed the request",
    "data": {
      "project": { /* project details */ },
      "chats": [ /* array of chat objects */ ]
    },
    "meta": { "page": 1, "limit": 10, "total": 5, ... },
    "error": {}
  }
  ```

---

### 2.3 Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "data": {},
  "error": {
    /* error details */
  }
}
```

---

## 3. Controllers

### 3.1 Overview

Controllers are responsible for handling HTTP requests, invoking business logic from services, and formatting responses. Each controller corresponds to a resource and exposes functions mapped to API endpoints.

---

### 3.2 UserController

**createUser(req, res)**

- Creates a new user in the database after validating the request body.
- Calls `UserService.createUser` with the request data.
- Returns a success response with the created user object.

**Parameters:**

- `req.body`: `{ firstName, lastName, email, password }`

**Logic:**

1. Validate input (middleware).
2. Call service to create user.
3. Return 201 with user data.

---

### 3.3 AuthController

**login(req, res)**

- Authenticates a user and issues JWT tokens as cookies.
- Calls `AuthService.login` with email and password.
- Sets `accessToken` and `refreshToken` cookies.
- Returns a success response with user data.

**Parameters:**

- `req.body`: `{ email, password }`

**Logic:**

1. Validate input (middleware).
2. Call service to authenticate and get tokens.
3. Set cookies and return user data.

**logout(req, res)**

- Clears authentication cookies and returns a logout confirmation.

---

### 3.4 ChatController

**addInteraction(req, res)**

- Adds a new message (interaction) to a chat, optionally creating a new chat or associating with a project.
- Calls `ChatService.addInteraction` with user, chatId, projectId, text, attachments, and model.
- Returns the created interaction and AI response.

**Parameters:**

- `req.user`: Authenticated user object
- `req.body`: `{ text, attachments, chatId, projectId, model }`

**Logic:**

1. Validate input (middleware).
2. Call service to add interaction and get AI response.
3. Return 201 with interaction data.

**getChat(req, res)**

- Retrieves the full chat history for a given chat ID.
- Calls `ChatService.getChatHistory`.
- Returns an array of chat messages (user and assistant turns).

**getAllChats(req, res)**

- Lists all chats for the authenticated user, paginated.
- Calls `ChatService.getAllChats`.
- Returns an array of chat summaries and pagination meta.

**updateChat(req, res)**

- Updates chat properties (e.g., title) for a given chat ID.
- Calls `ChatService.updateChat`.
- Returns the updated chat object.

**deleteUserChat(req, res)**

- Deletes a chat by ID for the authenticated user.
- Calls `ChatService.deleteUserChat`.
- Returns a success response.

---

### 3.5 ProjectController

**createProject(req, res)**

- Creates a new project for the authenticated user.
- Calls `ProjectService.createProject` with user, name, and description.
- Returns the created project object.

**getAllProjects(req, res)**

- Lists all projects for the authenticated user, paginated.
- Calls `ProjectService.getAllProjects`.
- Returns an array of projects and pagination meta.

**updateProject(req, res)**

- Updates project properties (name, description) for a given project ID.
- Calls `ProjectService.updateProject`.
- Returns the updated project object.

**deleteProject(req, res)**

- Deletes a project by ID.
- Calls `ProjectService.deleteProject`.
- Returns a success response.

**getAllChatsOfProject(req, res)**

- Retrieves all chats associated with a specific project.
- Calls `ProjectService.getAllChatsOfProject`.
- Returns project details and an array of chats.

---

## 4. Middlewares

### 4.1 Overview

Middlewares are functions that process requests before they reach controllers. They are used for validation, authentication, and error handling. Each resource has its own set of middlewares, which are composed in the route definitions.

---

### 4.2 UserMiddleware

**validateCreateUser(req, res, next)**

- Validates the request body for user creation.
- Ensures `firstName`, `email`, and `password` are present and valid.
- Uses `validator` to check email format and password length.
- On failure, returns a 400 error with details.

**Usage:** Applied to `POST /api/v1/user`.

---

### 4.3 AuthMiddleware

**validateLoginRqst(req, res, next)**

- Validates the login request body.
- Ensures `email` and `password` are present and valid.
- Uses `validator` to check email format.
- On failure, returns a 400 error with details.

**authenticateUser(req, res, next)**

- Authenticates the user using Clerk session (or a hardcoded userId for local dev).
- Checks if the user exists in the database.
- On failure, returns a 401 or 400 error.
- Attaches the user object to `req.user` for downstream handlers.

**Usage:** Applied to all protected routes (chat, project, etc).

---

### 4.4 ChatMiddleware

**validateMessage(req, res, next)**

- Validates the request body for chat messages.
- Ensures either `text` or `attachments` is present.
- On failure, returns a 400 error with details.

**Usage:** Applied to `POST /api/v1/chat`.

---

### 4.5 ProjectMiddleware

**validateCreateProjectRqst(req, res, next)**

- Validates the request body for project creation.
- Ensures `name` is present.
- On failure, returns a 400 error with details.

**validateUpdateProjectRqst(req, res, next)**

- Validates the request body for project updates.
- Ensures `name` is not empty or too long if provided.
- On failure, returns a 400 error with details.

**Usage:** Applied to `POST` and `PATCH` on `/api/v1/project`.

---

**Error Handling:**
All middlewares use a consistent error response format and custom `AppError` for clarity. Validation errors are returned with detailed messages and appropriate HTTP status codes.

---

## 5. Data Models

### 5.1 Overview

The backend uses Mongoose to define schemas for all core entities. Each model includes field definitions, validation, relationships, indexes, and hooks for data integrity.

---

### 5.2 User Model

**Fields:**

- `firstName` (String, required, 2-50 chars, lowercase)
- `lastName` (String, required, 2-50 chars, lowercase)
- `email` (String, required, unique, validated)
- `clerkId` (String, required, unique, Clerk integration)
- `profileColor` (String, default: #0078D7)
- `createdAt`, `updatedAt` (Date, auto-managed)

**Virtuals:**

- `fullName`: Combines first and last name

**Hooks:**

- `pre('save')`: Hashes password if present (password field is currently commented out)

**Indexes:**

- Unique on `email` and `clerkId`

---

### 5.3 Chat Model

**Fields:**

- `title` (String, max 200 chars)
- `userId` (ObjectId, ref: User, required)
- `projectId` (ObjectId, ref: Project, optional)
- `isArchived` (Boolean, default: false)
- `metadata` (Mixed)
- `createdAt`, `updatedAt` (Date, auto-managed)

**Hooks:**

- `pre('deleteOne')`: Deletes all interactions for the chat
- `pre('deleteMany')`: Deletes all interactions for multiple chats

**Indexes:**

- `{ userId: 1, createdAt: -1 }` for fast user chat queries

---

### 5.4 Interaction Model

**Fields:**

- `chat` (ObjectId, ref: Chat, required)
- `user` (ObjectId, ref: User, required)
- `input`: { `text`, `inputType`, `attachments`, `language`, `promptMetadata` }
- `response`: { `text`, `attachments`, `model`, `provider`, `generationOptions`, `tokens`, `stream`, `error`, `providerMeta` }
- `status` (String: queued, processing, completed, failed)
- `moderation` (flagged, categories, details)
- `isEdited`, `pinned` (Boolean)
- `editHistory` (Array of edit records)
- `metadata` (Mixed)
- `tags` (Array of String)
- `createdAt`, `updatedAt` (Date, auto-managed)

**Indexes:**

- `{ chat: 1, createdAt: 1 }`, `{ user: 1, createdAt: -1 }`, `{ status: 1, createdAt: 1 }`

---

### 5.5 Project Model

**Fields:**

- `user` (ObjectId, ref: User, required)
- `name` (String, required, max 100 chars)
- `description` (String, max 500 chars)
- `createdAt`, `updatedAt` (Date, auto-managed)

**Hooks:**

- `pre('deleteOne')`: Deletes all chats for the project

---

### 5.6 Attachment Model

**Fields:**

- `url` (String, required)
- `filename` (String)
- `mimeType` (String)
- `size` (Number, bytes)
- `provider` (String: cloudinary, uploadcare, s3, gcs, local, other)
- `uploadedBy` (ObjectId, ref: User)
- `width`, `height`, `pages` (Numbers, for images/docs)
- `thumbnailUrl` (String)
- `scanStatus` (String: pending, clean, flagged, error)
- `metadata` (Mixed)
- `createdAt`, `updatedAt` (Date, auto-managed)

**Indexes:**

- `{ uploadedBy: 1, createdAt: -1 }` for fast user attachment queries

---

## 6. Services

### 6.1 Overview

Services encapsulate business logic and coordinate between controllers, repositories, and external APIs. Each service is responsible for a specific domain (user, auth, chat, project, AI).

---

### 6.2 UserService

**createUser(data)**

- Registers a new user in the database after Clerk registration.
- Extracts user info from Clerk payload, generates a random profile color, and saves the user.
- Handles Clerk errors and throws `AppError` on failure.

---

### 6.3 AuthService

**login(data)**

- Authenticates a user by email and password.
- Validates password using the user model's method.
- Generates JWT access and refresh tokens.
- Returns user data (without password/clerkId) and tokens.
- Throws `AppError` on failure.

---

### 6.4 ChatService

**addInteraction({ user, chatId, projectId, userText, attachments, model })**

- Gets or creates a chat for the user/project.
- Creates a new interaction (message) and saves it.
- Fetches chat history and calls `AiService.getAIResponse` for an AI reply.
- Updates chat title if suggested by AI.
- Returns structured response with chat and AI reply.

**getChatHistory(chatId)**

- Retrieves all interactions for a chat, ordered by creation.

**getAllChats({ user, page, limit })**

- Returns paginated list of chats for the user.

**deleteUserChat({ user, id })**

- Deletes a chat by ID.

**updateChat({ user, body, id })**

- Updates allowed fields (e.g., title) for a chat.

---

### 6.5 ProjectService

**createProject({ user, name, description })**

- Creates a new project for the user.
- Returns the created project object (with sensitive fields removed).

**getAllProjects({ user, page, limit })**

- Returns paginated list of projects for the user.

**updateProject({ id, body })**

- Updates allowed fields (name, description) for a project.

**deleteProject({ id })**

- Deletes a project by ID (with transaction support).

**getAllChatsOfProject({ id, page, limit })**

- Returns project details and all chats for the project, paginated.

---

### 6.6 AiService

**getAIResponse(userText, chatHistory, opts = {})**

- Formats a prompt with conversation history and user input.
- Calls OpenAI (via `@ai-sdk/openai`) to generate a response.
- Parses and normalizes the AI response to a strict JSON schema.
- Handles errors and ensures the response is always structured.

---

## 7. Utilities and Error Handling

### 7.1 Overview

The project includes a set of utility modules for response formatting, error handling, and helper functions. These utilities ensure consistency, reduce boilerplate, and centralize common logic.

---

### 7.2 Common Utilities

**SuccessResponse()**

- Returns a standard success response object:
  ```js
  {
    success: true,
    message: "Successfully completed the request",
    data: {},
    error: {}
  }
  ```

**ErrorResponse()**

- Returns a standard error response object:
  ```js
  {
    success: false,
    message: "Something went wrong",
    data: {},
    error: {}
  }
  ```

**ENUMS**

- Placeholder for future enums (currently empty).

---

### 7.3 Error Classes

**AppError**

- Custom error class extending `Error`.
- Accepts a message and status code.
- Used throughout the app for consistent error handling.

**handleClerkError(error)**

- Parses Clerk API errors and throws an `AppError` with details.

---

### 7.4 Helpers

**generateRandomColorLight()**

- Returns a random color from a predefined palette for user profiles.

**asyncHandler(fn)**

- Wraps async route handlers to catch errors and pass them to Express error middleware.

**getFieldsToUpdate(allowedFields, fieldsToUpdate)**

- Returns an object with only the allowed fields from the update payload.

---

### 7.5 Error Handling Strategy

- All errors are caught and formatted using `ErrorResponse` and `AppError`.
- Validation and authentication errors return appropriate HTTP status codes and messages.
- The global error handler in `app.js` ensures all errors are returned in a consistent format.

---

## 8. Final Notes and Contribution

### 8.1 Contribution Guidelines

- Code is formatted with Prettier and checked on commit via Husky and lint-staged.
- To format code manually:
  ```sh
  npm run format
  ```
- To add new features, create new controllers, services, and routes as needed, following the modular structure.
- Ensure all new endpoints are documented and validated with appropriate middlewares.

### 8.2 License

This project is licensed under the MIT License.

---

#

## 9. Future Scope and Improvements

This section outlines potential enhancements and ideas for future development:

- **WebSocket/Realtime Support:**
  - Add real-time chat updates using WebSockets (e.g., Socket.io) for instant message delivery and typing indicators.
- **Advanced AI Features:**
  - Support for multi-modal AI (images, code, documents).
  - Integrate more advanced prompt engineering and context management.
- **User Roles and Permissions:**
  - Implement admin/moderator roles, project sharing, and granular access control.
- **Audit Logging and Analytics:**
  - Track user actions, chat statistics, and system health for monitoring and insights.
- **Rate Limiting and Abuse Prevention:**
  - Add per-user rate limits and abuse detection to protect the API and prevent spam.
- **Testing and CI/CD:**
  - Expand automated test coverage and set up continuous integration/deployment pipelines.
- **API Documentation:**
  - Generate OpenAPI/Swagger docs for easier client integration and onboarding.
- **Internationalization (i18n):**
  - Add support for multiple languages in the API and responses.
- **Pluggable Storage:**
  - Support for alternative file storage providers (S3, GCS, etc.) and database backends.
- **Performance Optimization:**
  - Profile and optimize database queries, caching, and response times for scale.

Feel free to contribute ideas or open issues/PRs for any of these improvements!

# End of Documentation
