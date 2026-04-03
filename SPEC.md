# Course Companion FTE - Technical Specification

## Project Overview
**Course Companion FTE** is a Digital Full-Time Equivalent educational tutor that works 24/7, providing AI-powered tutoring at scale with enterprise-grade reliability.

## Architecture
- **Dual Frontend**: ChatGPT App (Phase 1-2) + Web App (Phase 3)
- **Zero-Backend-LLM Default**: Phase 1 backend performs ZERO LLM inference
- **Hybrid Intelligence**: Phase 2 adds selective LLM features for premium users
- **Consolidated**: Phase 3 combines all features into single Web App

## Tech Stack
| Component | Technology | Phase |
|-----------|------------|-------|
| Backend | FastAPI (Python) | 1, 2, 3 |
| ChatGPT Frontend | OpenAI Apps SDK | 1, 2 |
| Web Frontend | Next.js/React | 3 |
| Storage | Cloudflare R2 | 1, 2, 3 |
| Database | Neon/Supabase (PostgreSQL) | 1, 2, 3 |

## Phase 1: Zero-Backend-LLM (45 points)
### Required Features (All 6)
1. **Content Delivery** - Serve course content verbatim, ChatGPT explains
2. **Navigation** - Chapter sequencing, ChatGPT suggests path
3. **Grounded Q&A** - Return relevant sections, ChatGPT answers
4. **Rule-Based Quizzes** - Grade with answer key, ChatGPT presents
5. **Progress Tracking** - Store completion/streaks, ChatGPT motivates
6. **Freemium Gate** - Check access rights, ChatGPT explains premium

### Strict Rules
- ✅ ALLOWED: Content APIs, Navigation APIs, Quiz APIs, Progress APIs, Search APIs, Access Control
- ❌ FORBIDDEN: LLM API calls, RAG summarization, Prompt orchestration, Agent loops, Content generation

## Phase 2: Hybrid Intelligence (20 points)
### Rules
- Maximum 2 hybrid features
- Must be premium-gated, user-initiated, feature-scoped
- Must justify why zero-LLM design insufficient

### Allowed Features (Choose up to 2)
A. Adaptive Learning Path
B. LLM-Graded Assessments  
C. Cross-Chapter Synthesis
D. AI Mentor Agent

## Phase 3: Web App (30 points)
- Full end-to-end Web App with Next.js
- Consolidated backend with all features
- Dashboard, progress visuals, admin features

## Agent Skills (SKILL.md)
1. **concept-explainer** - Explain concepts at various levels
2. **quiz-master** - Guide through quizzes with encouragement
3. **socratic-tutor** - Guide through questions, not answers
4. **progress-motivator** - Celebrate achievements, maintain motivation

## Course Topic: AI Agent Development
Selected Option A - Claude Agent SDK concepts, MCP, Agent Skills

## Deliverables
- [ ] Source Code (GitHub repo)
- [ ] Architecture Diagram
- [ ] SPEC.md (this document)
- [ ] Cost Analysis
- [ ] Demo Video (5 min)
- [ ] API Documentation (OpenAPI/Swagger)
- [ ] ChatGPT App Manifest (YAML)

## Success Criteria
- Phase 1: 45 points (Architecture 10, Features 10, ChatGPT UX 10, Web UX 10, Cost 5)
- Phase 2: 20 points (Value 5, Cost 5, Architecture 5, Gating 5)
- Phase 3: 30 points (Architecture 10, Features 5, Web UX 10, Cost 5)
- Bonus: Up to 13 additional points
