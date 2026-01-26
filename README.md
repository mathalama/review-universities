# University Platform

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## | О проекте

**University Platform** — это современное open-source решение для создания агрегатора отзывов об учебных заведениях. Проект разработан как масштабируемое Full-stack приложение, которое позволяет студентам делиться реальным опытом обучения, а абитуриентам — выбирать будущее место учебы на основе прозрачного рейтинга.

**Зачем это нужно:**
*   **Прозрачность**: Сбор честных отзывов и оценок.
*   **Централизация**: Единая база данных университетов с удобным поиском и тегами.
*   **Сообщество**: Система ролей позволяет администрировать контент и верифицировать пользователей через Email.

---

## | Архитектура системы

Проект следует принципам разделения ответственности (Separation of Concerns):

*   **Backend**: Stateless REST API с безопасностью на уровне JWT.
*   **Frontend**: Реактивный интерфейс с оптимистичными обновлениями для мгновенного отклика.
*   **Storage**: Реляционная БД (PostgreSQL) для данных и In-memory хранилище (Redis) для кэширования и сессий.

---

## | Технологический стек

### [ Backend ]
* **Java 17 / Spring Boot 3**
* **Spring Security & JWT**: Защита эндпоинтов и управление сессиями.
* **JPA / Hibernate**: Работа с базой данных PostgreSQL.
* **Flyway**: Версионирование схемы базы данных.
* **Redis**: Кэширование данных пользователей.
* **Resend SDK**: Интеграция с сервисом доставки Email.

### [ Frontend ]
* **React / TypeScript**
* **Vite**: Сверхбыстрая сборка.
* **Tailwind CSS**: Современная верстка.
* **Axios**: Взаимодействие с API.
* **Lucide React**: Набор системных иконок.

---

## | API Документация (Swagger)

Backend автоматически генерирует интерактивную документацию API. Это позволяет тестировать эндпоинты в реальном времени без сторонних инструментов.

*   **Swagger UI**: `http://localhost:8080/swagger-ui.html`
*   **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## | Конфигурация и .env

Для запуска проекта необходимо создать файлы `.env` в папках `backend/` и `frontend/` на основе предоставленных `.env.example`.

### Переменные Backend
| Ключ | Назначение |
| :--- | :--- |
| `DATABASE_URL` | Адрес PostgreSQL (напр. в Supabase или Neon) |
| `DATABASE_USERNAME` | Логин БД |
| `DATABASE_PASSWORD` | Пароль БД |
| `JWT_SECRET` | Секретный ключ (минимум 32 символа) |
| `ALLOWED_ORIGINS` | URL фронтенда (напр. `https://your-app.netlify.app`) |
| `RESEND_API_KEY` | Ключ из панели resend.com |
| `REDIS_HOST` | Адрес Redis (напр. в Upstash) |
| `REDIS_PORT` | Порт Redis |

### Переменные Frontend
| Ключ | Назначение |
| :--- | :--- |
| `VITE_API_URL` | Полный URL до вашего Backend API |

---

## | Развертывание (Deployment)

Проект полностью готов к CI/CD деплою:

1.  **Backend**: [Render.com](https://render.com) (автоматическая сборка через Dockerfile).
2.  **Frontend**: [Netlify.app](https://netlify.app) (Build command: `npm run build`, Directory: `dist`).
3.  **Database**: [Supabase.com](https://supabase.com) или [Neon.tech](https://neon.tech) (Managed PostgreSQL).
4.  **Redis**: [Upstash.com](https://upstash.com) (Serverless Redis с поддержкой протокола RESP).

---

## | Установка и запуск

### Сборка бэкенда
```bash
cd backend
./gradlew build
./gradlew bootRun
```

### Сборка фронтенда
```bash
cd frontend
npm install
npm run dev
```

---

## | Лицензия

Проект распространяется под лицензией MIT.