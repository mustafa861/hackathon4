# Demo Video Script - Course Companion FTE

**Total Duration: 5 minutes**

---

## 0:00 - 0:30 | Introduction (30 seconds)

**Visual:** Title screen with project name and team info

**Narration:**
"Hi, we're [Team Name] and this is our Course Companion FTE - a Digital Full-Time Equivalent educational tutor built for the Panaversity Agent Factory Hackathon IV. Our AI tutor works 168 hours per week, serves thousands of students simultaneously, and costs 99% less than human tutoring."

---

## 0:30 - 1:30 | Architecture (1 minute)

**Visual:** Architecture diagram showing Zero-Backend-LLM flow

**Narration:**
"Our architecture follows a Zero-Backend-LLM principle. In Phase 1, our FastAPI backend makes ZERO LLM calls. All intelligent work - explanations, tutoring, adaptation - happens in ChatGPT. The backend only serves content verbatim, grades quizzes with answer keys, tracks progress, and enforces access control.

This means near-zero marginal cost per user - about $0.002 per user per month. For Phase 2, we add selective hybrid intelligence for premium users only. Phase 3 consolidates everything into a full Next.js web app."

---

## 1:30 - 3:00 | Web Frontend Demo (1.5 minutes)

**Visual:** Screen recording of Next.js web app

**Narration:**
"Here's our Phase 3 Web App built with Next.js. Students land on the dashboard showing their progress - chapters completed, quiz scores, and learning streaks.

Clicking into a chapter, you see rich content with code examples, key points, and navigation between chapters. The freemium gate is visible - premium chapters are clearly marked.

The quiz system presents questions one at a time with immediate feedback. After completing a quiz, students see detailed results with explanations for every answer.

The progress dashboard shows comprehensive analytics - completion percentage, chapter details with scores and time spent, and full quiz history."

---

## 3:00 - 4:30 | ChatGPT App Demo (1.5 minutes)

**Visual:** Screen recording of ChatGPT conversation

**Narration:**
"Here's the ChatGPT App experience. Students can start learning by simply asking questions. The tutor fetches content from our backend and explains concepts at the student's level.

Watch how it handles different teaching modes:
- 'Explain AI agents' triggers the Concept Explainer skill
- 'Quiz me' activates the Quiz Master
- 'I'm stuck' engages the Socratic Tutor
- 'How am I doing?' brings up the Progress Motivator

All while the backend remains completely deterministic - zero LLM calls."

---

## 4:30 - 5:00 | Phase 2 Features (30 seconds)

**Visual:** Premium feature demo

**Narration:**
"For premium users, Phase 2 adds adaptive learning paths that analyze patterns and generate personalized recommendations, plus LLM-graded assessments that evaluate free-form answers with detailed feedback. These features are strictly premium-gated, user-initiated, and cost-tracked.

Our Course Companion FTE demonstrates that AI-native education can be both powerful and affordable. Thank you!"

---

## Key Demo Points to Hit

### Phase 1 (Must Show)
- [ ] Backend has ZERO LLM API calls
- [ ] All 6 features working
- [ ] ChatGPT App tutoring session
- [ ] Progress tracking persists
- [ ] Freemium gate functional

### Phase 2 (Must Show)
- [ ] Maximum 2 hybrid features
- [ ] Premium gating works
- [ ] User-initiated (not auto-triggered)
- [ ] Cost tracking visible

### Phase 3 (Must Show)
- [ ] Web app responsive
- [ ] Full user journey
- [ ] Progress dashboard
- [ ] Quiz system
