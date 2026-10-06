# Bliss Mind API

FastAPI, SQLAlchemy 2, and Pydantic backend. PostgreSQL is selected with
`DATABASE_URL`; without it the app uses `./bliss_mind.db` (SQLite). Tables are
created on startup, and sample session/article records are inserted only when
their respective tables are empty.

## Run locally

From this `backend` directory:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Set `DATABASE_URL` to a PostgreSQL connection string and replace `SECRET_KEY`
before deployment. `CORS_ORIGINS` is a comma-separated allowlist. Interactive
API documentation is available at `/docs`.

## API

- `POST /api/auth/register` (`full_name`, `email`, `password`) and
  `POST /api/auth/login` (`email`, `password`) return a bearer token and
  `{id, full_name, email, role}` user; `GET /api/auth/me` requires that token.
- `GET /api/sessions?q=...&category=...` lists/searches available catalog
  sessions, including current capacity and `spots_left`.
- Authenticated `POST /api/bookings` accepts `{session_id, payment_method}`
  (`mobile_money`, `card`, or `cash`); `GET /api/bookings/me` lists the caller's
  bookings and `PATCH /api/bookings/{id}/cancel` cancels one. Capacity changes
  are atomic. The method is only the user's selection: no payment credentials
  are collected and no payment gateway is invoked.
- `GET /api/articles` and `GET /api/articles/{slug}` serve wellness content.
- Public `POST /api/instructor-applications` accepts applicant details.
- Authenticated `GET /api/notifications/me` lists notifications and
  `PATCH /api/notifications/{id}/read` marks the caller's notification read.
- Authenticated `GET/PATCH /api/users/me` read/update the profile.

Run focused API tests with `pytest`.
