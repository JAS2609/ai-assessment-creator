# AI Assessment Creator

A full-stack AI-powered assessment generation platform that lets teachers create assignments, generate structured question papers using AI, and export them as PDFs — with real-time progress updates via WebSocket.

**Live Demo:** https://ai-assessment-creator-one-rho.vercel.app  
**Backend API:** https://ai-assessment-creator-backend.onrender.com  
**GitHub:** https://github.com/JAS2609/ai-assessment-creator

---

## Features

- **Assignment creation** — form with file upload (PDF text extraction), due date, question type rows, marks, and additional instructions
- **AI question generation** — structured prompt → Groq LLM → parsed + validated JSON (raw LLM response never rendered)
- **Real-time status** — WebSocket progress screen (`queued → processing → done`) with automatic redirect
- **Structured output** — exam paper with school header, student info, sections (A/B/C/D), difficulty tags, marks
- **PDF export** — proper A4 formatting via `@react-pdf/renderer`, not `window.print()`
- **Regenerate** — re-enqueues the job, deletes old result and Redis cache
- **Result caching** — 1-hour Redis TTL on generated papers

---

## Architecture

```
Browser (Next.js — Vercel)
    │
    ├── POST /api/assignments          ← Submit assignment form
    │        │
    │        ▼
    │   Express API (Render)
    │        │
    │        ├── Validate input (middleware)
    │        ├── Save assignment → MongoDB Atlas
    │        ├── Enqueue job → BullMQ (Upstash Redis)
    │        └── Return { assignmentId }
    │
    ├── WebSocket (wss://)             ← Real-time status updates
    │        │
    │        ▼
    │   BullMQ Worker
    │        │
    │        ├── Pull job from Redis queue
    │        ├── Build structured prompt
    │        ├── Call Groq LLM (llama-3.3-70b-versatile)
    │        ├── Parse + validate JSON response
    │        ├── Save result → MongoDB Atlas
    │        └── Emit WebSocket event { status: 'done', assignmentId }
    │
    └── GET /api/assignments/:id/result  ← Fetch structured paper (Redis cached)
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 + TypeScript | App framework with App Router |
| Zustand | Client state management (form + WebSocket status) |
| Tailwind CSS | Styling |
| @react-pdf/renderer | PDF export |
| pdfjs-dist | Extract text from uploaded PDFs |
| react-hook-form + Zod | Form validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express + TypeScript | REST API server |
| MongoDB + Mongoose | Store assignments and generated results |
| BullMQ | Background job queue for AI generation |
| Upstash Redis | Queue transport + result caching (1hr TTL) |
| ws | WebSocket server for real-time status |
| Groq SDK | LLM inference (llama-3.3-70b-versatile) |

### Infrastructure
| Service | Usage |
|---------|-------|
| Vercel | Frontend deployment |
| Render | Backend deployment (free tier — may take ~30s to wake on first request) |
| MongoDB Atlas | Managed MongoDB |
| Upstash | Managed Redis |

---

## Approach

### 1. Assignment Creation
The teacher fills a form with subject, due date, question type rows (each with type, count, and marks), and an optional file upload. Total questions and marks are calculated live on the client. On submit, Zod validation runs first on the client, then the server runs its own validation middleware before any DB write — so bypassing the frontend via Postman still returns a proper 400.

### 2. AI Generation Pipeline
Once the assignment is saved, a BullMQ job is enqueued immediately. The worker:
- Builds a **structured prompt** specifying exact section layout, mark distribution, difficulty ratios (40% easy / 40% medium / 20% hard), and JSON-only output
- Calls Groq's `llama-3.3-70b-versatile`
- **Parses and validates** the response — sanitises every field, fills defaults for missing values, and throws if the structure is invalid
- Saves the typed result to MongoDB and broadcasts a WebSocket event

The raw LLM response is never rendered — only the parsed, validated, typed data structure reaches the output page.

### 3. Real-time Updates
The frontend connects to WebSocket immediately after form submission using `assignmentId` as a query param. The server maintains a `Map<assignmentId, Set<WebSocket>>` for targeted broadcasts. On `done`, the client automatically redirects to the result page.

### 4. Output Page
Rendered as a structured exam paper — school header, student info lines, sections (A/B/C/D), questions with inline difficulty tags, and marks. Teachers can regenerate (re-enqueues the job, deletes old result + cache) or download as a formatted A4 PDF.

### 5. Caching
Generated results are cached in Redis with a 1-hour TTL. Cache is invalidated automatically on regeneration.

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker Desktop

### 1. Clone
```bash
git clone https://github.com/JAS2609/ai-assessment-creator.git
cd ai-assessment-creator
```

### 2. Start MongoDB + Redis
```bash
docker-compose up -d
```

Verify:
```bash
docker ps
# Should show ai-assessment-mongo and ai-assessment-redis as "Up"
```

### 3. Backend
```bash
cd apps/server
npm install
cp .env.example .env
# Add your GROQ_API_KEY in .env
npm run dev
# Runs at http://localhost:4000
```

### 4. Frontend
```bash
cd apps/web
npm install
cp .env.example .env.local
# Pre-filled for local dev — no changes needed
npm run dev
# Runs at http://localhost:3000
```

### Environment Variables

**`apps/server/.env`**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ai-assessment
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=gsk_your_key_here
FRONTEND_URL=http://localhost:3000
```

**`apps/web/.env.local`**
```
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

---

## API Reference

Base URL: `https://ai-assessment-creator-backend.onrender.com`

### `POST /api/assignments`
Create an assignment and enqueue AI generation.

```json
// Request
{
  "title": "Physics Mid Term",
  "subject": "Physics",
  "dueDate": "2026-12-01",
  "questionTypes": ["mcq", "short_answer"],
  "totalQuestions": 10,
  "totalMarks": 30,
  "additionalInstructions": "Focus on mechanics and waves"
}

// 201
{ "assignmentId": "6a14b37b5f7fca9e417534ed" }

// 400
{ "errors": ["title must be at least 3 characters", "dueDate must be in the future"] }
```

### `GET /api/assignments`
List all assignments (sorted by newest first).

### `GET /api/assignments/:id`
Get status of an assignment. Values: `queued` | `processing` | `done` | `failed`

### `GET /api/assignments/:id/result`
Fetch the generated question paper (Redis cached, 1hr TTL).

```json
{
  "assignmentId": "6a14b37b5f7fca9e417534ed",
  "title": "Physics Mid Term",
  "subject": "Physics",
  "totalMarks": 30,
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "id": "A1",
          "text": "What is the unit of force in the SI system?",
          "type": "mcq",
          "difficulty": "easy",
          "marks": 1,
          "options": ["A. Newton", "B. Joule", "C. Watt", "D. Pascal"]
        }
      ]
    }
  ]
}
```

### `POST /api/assignments/:id/regenerate`
Delete existing result and re-enqueue generation.

### `GET /api/assignments/count`
Total assignment count (used for sidebar badge).

### WebSocket
```
wss://ai-assessment-creator-backend.onrender.com?id=<assignmentId>
```
```json
{ "type": "status_update", "assignmentId": "...", "status": "queued" }
{ "type": "status_update", "assignmentId": "...", "status": "processing" }
{ "type": "status_update", "assignmentId": "...", "status": "done" }
{ "type": "status_update", "assignmentId": "...", "status": "failed", "error": "..." }
```

---

## Project Structure

```
ai-assessment-creator/
├── apps/
│   ├── server/
│   │   └── src/
│   │       ├── config/          # db.ts, redis.ts
│   │       ├── middleware/      # validateAssignment.ts
│   │       ├── models/          # Assignment.ts, Result.ts
│   │       ├── queues/          # assessmentQueue.ts
│   │       ├── routes/          # assignments.ts
│   │       ├── services/        # llmService.ts, promptBuilder.ts
│   │       ├── workers/         # generationWorker.ts
│   │       ├── ws/              # wsManager.ts
│   │       └── index.ts
│   │
│   └── web/
│       ├── app/
│       │   ├── assignments/
│       │   │   ├── page.tsx             # Assignment list
│       │   │   ├── create/page.tsx      # Creation form
│       │   │   └── [id]/
│       │   │       ├── generating/page.tsx
│       │   │       └── result/page.tsx
│       │   └── api/assignments/         # Next.js API proxy routes
│       ├── components/
│       │   ├── Sidebar.tsx
│       │   ├── Topbar.tsx
│       │   ├── PaperPDF.tsx
│       │   └── output/
│       │       ├── QuestionPaperView.tsx
│       │       ├── ExamHeader.tsx
│       │       ├── StudentInfoSection.tsx
│       │       ├── ActionBar.tsx
│       │       ├── SectionBlock.tsx
│       │       └── QuestionCard.tsx
│       ├── hooks/               # useAssignmentSocket.ts
│       ├── store/               # assignmentStore.ts (Zustand)
│       └── utils/               # downloadPaper.ts, extractPdfText.ts
│
├── packages/
│   └── types/                   # Shared TypeScript types
├── docker-compose.yml
└── README.md
```