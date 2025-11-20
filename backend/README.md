# Habit Hero Backend

Spring Boot 3.2 Java 17 backend for the Habit Hero Admin Module.

## Environment Variables

- `DEV_ADMIN_EMAIL`: Email for the seeded admin user (default: `admin@habithero.com`)
- `DEV_ADMIN_PASSWORD`: Password for the seeded admin user (default: `admin123`)
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account JSON (default: `./firebase-service-account.json`)
- `FIREBASE_PROJECT_ID`: Firebase project ID

## How to Run

1. **Build**:

    ```bash
    mvn clean install
    ```

2. **Run**:

    ```bash
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
    ```

3. **Test**:

    ```bash
    chmod +x ../scripts/test-backend.sh
    ../scripts/test-backend.sh
    ```

## Reference

- Screenshot: file:///mnt/data/3547872C-B6B4-44E5-B937-F2FCE43383E0.jpeg

## Endpoints

- `GET /api/admin/dashboard`
- `GET /api/admin/habits`
- `GET /api/admin/habits/{id}/stats`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/{id}`
- `DELETE /api/admin/coupons/{id}`
- `GET /api/admin/users`

