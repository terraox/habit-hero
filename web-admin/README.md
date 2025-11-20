# Habit Hero - Admin (web-admin)

## Quick start (dev)
1. cd web-admin
2. npm ci
3. cp .env.example .env   # edit values if needed
4. npm run dev
5. Open http://localhost:5173

## Notes
- Edit VITE_API_BASE in `.env` to point to your backend (e.g. http://localhost:8080/api)
- Drop `google-services.json` or update firebase paths in backend when enabling pushes.
- This admin uses mock fallback login if your backend login is unreachable.
