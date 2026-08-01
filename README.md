# PharmaPrep Uganda

Exam prep platform for Ugandan pharmacy pre-licensure & post-internship candidates.

## Phase 1 (this drop)
- Next.js 14 App Router + TypeScript + Tailwind scaffold, with your exact color tokens and Sora / Source Serif 4 / DM Sans fonts wired up
- Full Prisma schema — every model from the spec (User, Subject, Topic, Note, NoteImage, Video, Question, Option, QuizAttempt, Progress, Bookmark, Payment) plus NextAuth's Account/Session/VerificationToken tables
- NextAuth config: Credentials (bcrypt) + Google OAuth, JWT session with `role`/`plan` on the token
- Middleware protecting `/admin/*` (ADMIN only) and all authenticated routes
- Cloudinary, Upstash Redis (1‑hour note cache), Flutterwave (UGX pricing tiers), and Resend helpers, ready to be called from API routes in later phases
- next-pwa config with offline caching rules for pages and Cloudinary images
- Seed script: 12 subjects, 3 topics each, 2 notes/topic, 3 videos/topic, 10 questions/topic (5 free/5 premium), 1 admin + 3 student users

## Not yet built (coming in Phase 2+, following your build order)
Landing page, login/register UI, dashboard, subjects/topics pages, note viewer, video player,
quiz (practice + mock exam), question bank, admin panel (dashboard, note editor, question editor,
video manager, users table), Cloudinary/Flutterwave API routes + webhook, PWA icons, deploy config.

## Running it locally (PowerShell)

```powershell
# 1. Unzip and enter the project
cd pharmaprep-uganda

# 2. Install dependencies
npm install

# 3. Copy env template and fill in real values
Copy-Item .env.example .env
notepad .env   # paste your Supabase, Google, Cloudinary, Flutterwave, Upstash, Resend keys

# 4. Push the schema to your Supabase Postgres database
npx prisma db push

# 5. Seed subjects/topics/notes/videos/questions + admin & sample users
npm run db:seed

# 6. Run the dev server
npm run dev
```

Then open http://localhost:3000.

**Admin login (after seeding):** `admin@pharmaprep.ug` / `Admin@1234`
**Sample student login:** `sarah@example.ug` / `Student@1234`

### Getting your keys
- **DATABASE_URL** — Supabase project → Settings → Database → Connection string (use the "Transaction" pooler URL, port 6543, with `?pgbouncer=true`)
- **NEXTAUTH_SECRET** — run `openssl rand -base64 32` (Git Bash/WSL) or `[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))` in PowerShell
- **GOOGLE_CLIENT_ID/SECRET** — Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web), redirect URI `http://localhost:3000/api/auth/callback/google`
- **CLOUDINARY_*** — Cloudinary dashboard → API keys
- **FLUTTERWAVE_*** — Flutterwave dashboard → Settings → API Keys (use test keys first), webhook secret under Settings → Webhooks
- **UPSTASH_REDIS_*** — Upstash console → Redis database → REST API section
- **RESEND_API_KEY / FROM_EMAIL** — Resend dashboard → API Keys (verify your sending domain first)

## Notes on this drop
This was built without network access, so packages have not been installed or run in this
environment — `npm install` on your machine is the first real compile/type-check. If a
dependency version needs bumping (e.g. a patch release), `npm install <pkg>@latest` is safe
for everything except `next`, `@prisma/client`, and `next-auth`, which are pinned intentionally.
