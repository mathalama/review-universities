# University Platform

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## | About the Project

**University Platform** is a modern open-source solution for creating a review aggregator for educational institutions. The project is developed as a scalable Full-stack application that allows students to share real learning experiences and applicants to choose their future place of study based on transparent ratings.

**Key Features:**
*   **Transparency**: Collection of honest reviews and ratings.
*   **Centralization**: A unified database of universities with easy search and tagging.
*   **Community**: A role-based system for content administration and user verification via email.
*   **Security**: Rate limiting and secure authentication to prevent abuse.

---

## | System Architecture

The project follows the principles of Separation of Concerns:

*   **Backend**: Stateless REST API secured with JWT.
*   **Frontend**: Reactive interface with optimistic updates for an instant response.
*   **Storage**: Relational database (PostgreSQL) for data and In-memory storage (Redis) for caching and session management (e.g., password reset tokens).

---

## | Tech Stack

### [ Backend ]
* **Java 17 / Spring Boot 3.2.2**
* **Spring Security & JWT**: Endpoint protection and session management.
* **JPA / Hibernate**: Data persistence with PostgreSQL.
* **Flyway**: Database schema versioning.
* **Redis**: Caching and temporary data storage.
* **Resend SDK**: Integration with email delivery service.
* **Bucket4j**: Rate limiting for API protection.

### [ Frontend ]
* **React 19 / TypeScript 5.9**
* **Vite 7**: Ultra-fast build tool.
* **Tailwind CSS 4**: Modern utility-first CSS framework.
* **Axios**: API communication.
* **Lucide React**: Icon set.
* **React Router 7**: Client-side routing.

---

## | API Documentation (Swagger)

The backend automatically generates interactive API documentation. This allows you to test endpoints in real-time without third-party tools.

*   **Swagger UI**: `http://localhost:8080/swagger-ui.html`
*   **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## | Configuration and .env

To run the project, you need to create `.env` files in the `backend/` and `frontend/` directories based on the provided `.env.example` files.

### Backend Variables
| Key | Purpose |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL address (e.g., Supabase or Neon) |
| `DATABASE_USERNAME` | DB Login |
| `DATABASE_PASSWORD` | DB Password |
| `JWT_SECRET` | Secret key (minimum 32 characters) |
| `ALLOWED_ORIGINS` | Frontend URL (e.g., `https://your-app.netlify.app`) |
| `RESEND_API_KEY` | API key from resend.com |
| `REDIS_HOST` | Redis address (e.g., Upstash) |
| `REDIS_PORT` | Redis port |

### Frontend Variables
| Key | Purpose |
| :--- | :--- |
| `VITE_API_URL` | Full URL to your Backend API |

---

## | Deployment

The project is fully ready for CI/CD deployment:

1.  **Backend**: [Render.com](https://render.com) (automatic build via Dockerfile).
2.  **Frontend**: [Netlify.app](https://netlify.app) (Build command: `npm run build`, Directory: `dist`).
3.  **Database**: [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech) (Managed PostgreSQL).
4.  **Redis**: [Upstash.com](https://upstash.com) (Serverless Redis with RESP protocol support).

---

## | Installation and Startup

### Building the Backend
```bash
cd backend
./gradlew build
./gradlew bootRun
```

### Building the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## | License

This project is licensed under the MIT License.
