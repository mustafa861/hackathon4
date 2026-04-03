# Architecture Diagram - Course Companion FTE

## Phase 1: Zero-Backend-LLM Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / STUDENT                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   ChatGPT App   │          │   Web App (P3)  │
     │  (OpenAI SDK)   │          │   (Next.js)     │
     │                 │          │                 │
     │  - LLM Reasoning│          │  - Dashboard    │
     │  - Explanations │          │  - Visuals      │
     │  - Tutoring     │          │  - Progress     │
     │  - Quiz UI      │          │  - Content      │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              │         HTTP REST API       │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │     FastAPI Backend         │
              │   (Zero LLM Calls)          │
              │                             │
              │  ┌───────────────────────┐  │
              │  │  Content APIs         │  │
              │  │  GET /chapters/       │  │
              │  │  GET /chapters/{id}   │  │
              │  │  GET /chapters/{id}/  │  │
              │  │    navigation         │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │  Quiz APIs            │  │
              │  │  GET /quizzes/        │  │
              │  │  POST /quizzes/{id}/  │  │
              │  │    submit             │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │  Progress APIs        │  │
              │  │  GET /progress/{uid}  │  │
              │  │  PUT /progress/{uid}  │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │  Access Control       │  │
              │  │  POST /access/check   │  │
              │  └───────────────────────┘  │
              │  ┌───────────────────────┐  │
              │  │  Search API           │  │
              │  │  GET /search/?q=      │  │
              │  └───────────────────────┘  │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┴──────────────┐
              │        DATA LAYER           │
              │                             │
              │  ┌──────────┐ ┌──────────┐ │
              │  │ SQLite / │ │ JSON     │ │
              │  │ Postgres │ │ Files    │ │
              │  │          │ │ (content)│ │
              │  └──────────┘ └──────────┘ │
              │  ┌───────────────────────┐  │
              │  │  Agent Skills         │  │
              │  │  (SKILL.md files)     │  │
              │  └───────────────────────┘  │
              └─────────────────────────────┘
```

## Phase 2: Hybrid Intelligence Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / STUDENT                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │     ChatGPT App             │
              │                             │
              │  Free Users → Deterministic │
              │  Premium Users → Hybrid     │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │     FastAPI Backend         │
              │                             │
              │  ┌───────────────────────┐  │
              │  │  Deterministic APIs   │  │
              │  │  (Phase 1 - Free)     │  │
              │  │  - Content            │  │
              │  │  - Quizzes            │  │
              │  │  - Progress           │  │
              │  │  - Access             │  │
              │  │  - Search             │  │
              │  └───────────────────────┘  │
              │           │                 │
              │  ┌────────▼──────────────┐  │
              │  │  Hybrid APIs (P2)     │  │
              │  │  (Premium Only)       │  │
              │  │  - Adaptive Path ─────┼──┼──► LLM API
              │  │  - LLM Assessment ────┼──┼──► LLM API
              │  └───────────────────────┘  │
              └─────────────────────────────┘
```

## Phase 3: Consolidated Web App Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / STUDENT                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   Next.js Web App           │
              │                             │
              │  ┌───────────────────────┐  │
              │  │  Dashboard            │  │
              │  │  Chapter Viewer       │  │
              │  │  Quiz System          │  │
              │  │  Progress Tracker     │  │
              │  │  Search               │  │
              │  │  Admin Panel          │  │
              │  └───────────────────────┘  │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │     FastAPI Backend         │
              │   (All Features Combined)   │
              │                             │
              │  ┌───────────────────────┐  │
              │  │  All Phase 1 APIs     │  │
              │  │  + Phase 2 Hybrid     │  │
              │  │  + Phase 3 Features   │  │
              │  └───────────────────────┘  │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┴──────────────┐
              │  SQLite / PostgreSQL + R2   │
              └─────────────────────────────┘
```

## Data Flow - Zero-Backend-LLM

```
Student asks: "What is an AI agent?"
                    │
                    ▼
┌──────────────────────────────────────────┐
│  ChatGPT (does ALL intelligent work)     │
│                                          │
│  1. Calls GET /api/v1/chapters/ch1       │
│  2. Receives content verbatim            │
│  3. Explains at student's level          │
│  4. Provides analogies                   │
│  5. Answers follow-up questions          │
│  6. Calls PUT /api/v1/progress/{user}    │
│     to track learning                    │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  Backend (ZERO LLM calls)                │
│                                          │
│  - Serves content from JSON files        │
│  - Grades quizzes with answer keys       │
│  - Tracks progress in database           │
│  - Checks access rights                  │
│  - Searches content (keyword match)      │
└──────────────────────────────────────────┘
```

## Component Interaction Map

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  Chapters   │───►│   Quizzes    │───►│   Progress   │
│  Module     │    │   Module     │    │   Module     │
└─────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  Content    │    │  Quiz Grader │    │  Streak      │
│  Delivery   │    │  (Rule-based)│    │  Tracker     │
└─────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                  ┌────────────────┐
                  │  Access Control│
                  │  (Freemium)    │
                  └────────────────┘
                           │
                  ┌────────▼────────┐
                  │  Search Engine  │
                  │  (Keyword)      │
                  └─────────────────┘
```
