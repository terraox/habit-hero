# Habit Hero

Habit Hero is a comprehensive habit tracking platform featuring a Spring Boot backend, a React admin dashboard, and a React Native mobile app.

## Project Structure

- **backend/**: Spring Boot 3.2 application (Java 17) with PostgreSQL.
- **web-admin/**: React + Vite admin dashboard.
- **mobile-app/**: React Native (Expo) mobile application.
- **docker-compose.yml**: Orchestration for the entire stack.

## Prerequisites

- Docker & Docker Compose
- Java 17+ (for local backend dev)
- Node.js 18+ (for frontend/mobile dev)

## Quick Start (Docker)

The easiest way to run the entire stack (Database, Backend, Admin Panel) is using Docker Compose.

1. **Start the stack:**

   ```bash
   docker-compose up --build
   ```

2. **Access the services:**
   - **Admin Dashboard:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **MailHog (Email Testing):** [http://localhost:8025](http://localhost:8025)

3. **Default Admin Credentials:**
   - **Email:** `help.habithero@gmail.com`
   - **Password:** `shipDock123*`

## Manual Setup (Development)

### 1. Database

Start the PostgreSQL database and MailHog using Docker:

```bash
docker-compose up db mailhog -d
```

### 2. Backend

Navigate to the `backend` directory and run the application:

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on port `8080`.

### 3. Web Admin

Navigate to the `web-admin` directory and start the dev server:

```bash
cd web-admin
npm install
npm run dev
```

The admin panel will be available at [http://localhost:5173](http://localhost:5173).

### 4. Mobile App

Navigate to the `mobile-app` directory and start Expo:

```bash
cd mobile-app
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone.

## Configuration

- **Database:** Configured in `backend/src/main/resources/application.properties`.
- **Firebase:** Place your `firebase-service-account.json` in the `backend/` root directory.
- **CORS:** Configured in `SecurityConfig.java` to allow `localhost:5173` and `localhost:3000`.

## API Documentation

The backend provides RESTful endpoints for:

- **Admin Dashboard:** `/api/admin/dashboard`
- **Habits:** `/api/admin/habits`
- **Coupons:** `/api/admin/coupons`
- **Users:** `/api/admin/users`

Authentication is handled via Basic Auth.
