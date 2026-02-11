# 🚀 Full-Stack PostgreSQL Blog Engine

## 📖 Introduction

This project was built to deeply understand **RESTful API design**, backend–frontend separation, and database-driven application architecture. My goal was to move beyond simple "all-in-one" apps and truly understand the _why_ and _how_ behind modern web architecture.

This project is built on a **RESTful Architecture**. This means the application uses a standardized set of rules and HTTP methods to allow the Frontend and Backend to communicate seamlessly. By following REST principles, I implemented a full **CRUD** (Create, Read, Update, Delete) cycle:

- **Create:** `POST` requests to generate new entries.
- **Read:** `GET` requests to fetch data.
- **Update:** `PATCH` requests for smart, partial data modification.
- **Delete:** `DELETE` requests to remove records safely.

**Key Takeaways:**

- **Separation of Concerns:** The UI server doesn't need to know how to write complex SQL or manage database drivers; it simply "asks" the API for what it needs.
- **Data Abstraction:** The API handles the "heavy lifting" of database connections and security, allowing the frontend to focus entirely on user experience without the "hustle" of direct data handling.
- **Scalability:** Because the database logic is isolated within the API, I could theoretically connect a mobile app or a different frontend to the same API without changing a single line of database code.

---

## 🏗️ Architecture

- **Frontend Server (Port 3000):** Handles UI rendering via EJS and routes requests using Axios.
- **API Server (Port 4000):** Manages database logic and CRUD operations.
- **Database:** PostgreSQL for persistent data storage.

### 1. Database Setup

Create a PostgreSQL database and run the following schema:

SQL

```
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

```

### 2. Environment Variables

Create a `.env` file in the root directory:

Code snippet

```
DB_USER=your_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
APP_PORT=4000
SERVER_PORT=3000
API_URL=http://localhost:4000
```

### 3. Installation

Bash

```
# Install dependencies
npm install

# Start the API Server (Port 4000)
node index.js

# Start the Frontend Server (Port 3000)
node server.js

```

---

## 🛠️ API Endpoints

| **Method** | **Endpoint** | **Description**              |
| ---------- | ------------ | ---------------------------- |
| **GET**    | `/posts`     | Get all blog posts           |
| **GET**    | `/posts/:id` | Get a single post            |
| **POST**   | `/posts`     | Create a new post            |
| **PATCH**  | `/posts/:id` | Update a post (Full/Partial) |
| **DELETE** | `/posts/:id` | Remove a post                |

---

## ✨ Features

- **Decoupled Design:** API and UI run on independent servers.
- **Partial Updates:** PATCH endpoints preserve existing values when fields are omitted.
- **Defensive Coding:** Includes ID validation and database connection pooling.
- **Responsive UI:** Styled with CSS and rendered with EJS templates.

---

## 🛡️ Authentication Note

This application is not deployed publicly yet.

At the current stage, all CRUD routes are publicly accessible.
Before deploying to production, I plan to implement:

- User authentication (JWT / sessions)
- Route protection
- Authorization for create/edit/delete actions

The project is intentionally kept undeployed at this stage to avoid
security issues with public access.

---

## 📈 Planned Enhancements

- User authentication and authorization
- Role-based access control
- Protected API routes
- Deployment on cloud platform
