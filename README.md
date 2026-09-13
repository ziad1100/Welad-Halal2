# ولاد حلال | Welad Halal POS/ERP

Turborepo: `apps/web` (Vite+React19) + `apps/backend` (NestJS+Prisma) + `packages/*`.

## Local dev (Docker-first)

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npm run seed
docker compose exec backend npm run seed:status
# health
curl http://localhost:3001/api/health
curl http://localhost:3001/api/health/database
# login (once)
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Ahmed Elseyad\",\"password\":\"weladhalal\"}"
# web
open http://localhost:5173
```

Owner: `Ahmed Elseyad / weladhalal` (seed-hardcoded, bcrypt 10).
