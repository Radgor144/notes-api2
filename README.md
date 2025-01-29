# NotesApi

## Table of Contents

- [General Info](#general-info)
- [Requirements](#requirements)
- [Technologies](#technologies)
- [Endpoints](#endpoints)
- [How to Run Locally](#how-to-run-locally)

## General Info <a name="general-info"></a>

**NotesApi** is a microservices-based application for managing notes. It consists of two core backend services:
- **Auth Service** – Handles user authentication using **JWT Bearer tokens** for secure communication and token validation.
- **Notes-api** – Manages note creation, retrieval, updating, and deletion.

The application follows a **RESTful API** architecture and is built using **Spring Boot**. It integrates with external services using **Feign clients** and documents APIs using **OpenAPI**.

> **Frontend**: The frontend is built using **React** and provides an interactive user interface for managing notes and interacting with the backend services.

> **Authentication**: The application uses **JWT Bearer tokens** for secure user authentication. After logging in, users receive a JWT token, which must be included in the `Authorization` header of requests to access protected endpoints.

## Endpoints <a name="endpoints"></a>

### Auth Service

| Method | URL                       | Description                                  |
|--------|---------------------------|----------------------------------------------|
| `POST` | `/api/auth/register`       | Registers a new user                         |
| `POST` | `/api/auth/authenticate`   | Authenticates a user and returns a JWT token |
| `GET`  | `/api/auth/validateToken`  | Validates the provided JWT authentication token. |

> **Note:** To authenticate and obtain a token, use the `/api/auth/authenticate` endpoint by providing the user's credentials. The received token should be sent in the `Authorization` header as `Bearer <token>` for subsequent requests.

### Notes-api

| Method   | URL                     | Description                          |
|----------|-------------------------|--------------------------------------|
| `GET`    | `/api/v1/notesGet`       | Retrieves a paginated list of notes. |
| `GET`    | `/api/v1/notesIdGet`     | Retrieves a specific note by its ID. |
| `DELETE` | `/api/v1/notesIdDelete`  | Deletes a specific note by its ID.   |
| `PUT`    | `/api/v1/notes/{id}`     | Updates an existing note by its ID.  |
| `POST`   | `/api/v1/notesPost`      | Creates a new note.                  |

## Requirements <a name="requirements"></a>

- **JDK 21** - The core programming language for building the project.
- **Maven 3.x** - Tool for managing dependencies, building, and managing projects.
- **Docker** - Containerization platform for packaging applications and their dependencies.

## How to Run Locally <a name="how-to-run-locally"></a>

### Steps:
1. Clone the repository.
2. Build the services:
    - **Frontend**:
        1. Navigate to the `frontend/` folder.
        2. Run `npm install` to install dependencies.
        3. Run `npm run build` to build the frontend.

    - **Notes API**:
        1. Navigate to the `notes-api/` folder.
        2. Run `mvn clean package` to build the service.

    - **Auth Service**:
        1. Navigate to the `auth-service/` folder.
        2. Run `mvn clean package` to build the service.

3. Run `docker-compose up` to start all services.

## Technologies <a name="technologies"></a>

### Project Created With:
- **Java 21** - Core programming language.
- **Spring Boot** - Framework used for rapid development of microservices-based applications.
- **React** - JavaScript library for building interactive user interfaces.
- **JWT** - JSON Web Token for secure user authentication.
- **Postgres** - Relational database used to store user and note data.

### Integration:
- **Feign** - Declarative web service client that simplifies communication between services.
- **Docker** - Containerization platform for packaging applications and their dependencies.

### Documentation:
- **OpenAPI** - Auto-generates API documentation for better interactivity, comprehension, and testing of API features.

### Build Tools:
- **Maven** - Tool for managing dependencies, building, and managing projects.

## API Contracts <a name="api-contracts"></a>

The project uses **OpenAPI contracts** to define the APIs for both the **Auth Service** and **Notes-api**. The API documentation is auto-generated using OpenAPI annotations in the code.

### Auth Service API Contract:
- The **Auth Service** exposes endpoints for user registration, authentication, and token validation.
- This service is responsible for issuing JWT tokens, which are used for secure communication between services.

### Notes Service API Contract:
- The **Notes-api** exposes endpoints for CRUD operations related to notes.
- These endpoints are protected and require authentication via JWT Bearer tokens issued by the **Auth Service**.

### Integration via Feign:
- The **Notes-api** uses **Feign clients** to communicate with the **Auth Service**, leveraging the API contract for authentication and token validation.

### OpenAPI Documentation:
- Both services use **OpenAPI** annotations to automatically generate and expose the API documentation.
- You can explore and test the API directly through the generated documentation.

## Key Features:
- User authentication with token-based security.
- CRUD operations for managing notes.
- Paginated retrieval of notes.
- Docker support for containerized deployment.
- Feign integration for seamless communication between microservices.
- OpenAPI documentation for API exploration and testing.
