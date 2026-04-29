# Online Test Platform

Full-stack platform with student and admin roles.

## Stack
- Frontend: React + Vite + Tailwind + React Router + Axios + Zod
- Backend: Node + Express
- DB/Auth: Supabase PostgreSQL with email role detection

## Setup

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Supabase
Run SQL from `backend/supabase/schema.sql` in Supabase SQL editor.

Insert users with roles:
```sql
insert into users (email, role) values
('student1@example.com', 'student'),
('admin1@example.com', 'admin');
```

## APIs
- `POST /api/auth/login`
- `GET /api/student/tests?userId=<id>`
- `GET /api/student/test/:id`
- `POST /api/student/start-test`
- `POST /api/student/save-answer`
- `POST /api/student/submit-test`
- `GET /api/student/performance?userId=<id>`
- `POST /api/admin/parse-json`
- `POST /api/admin/publish-test`

## Deployment
- Frontend: Vercel (set `VITE_API_URL`)
- Backend: Render (set env values from backend `.env.example`)
- Database: Supabase
