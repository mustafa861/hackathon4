export interface Chapter {
  chapter_id: string
  title: string
  description: string
  content: ChapterContent[]
  order: number
  is_premium: boolean
  prerequisites: string[]
}

export interface ChapterContent {
  section: string
  text: string
  code_examples?: Array<{ language: string; code: string }>
  key_points?: string[]
}

export interface ChapterNavigation {
  current: Chapter
  previous?: Chapter
  next?: Chapter
}

export interface Quiz {
  quiz_id: string
  chapter_id: string
  title: string
  questions: Question[]
  passing_score: number
  is_premium: boolean
}

export interface Question {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface QuizResult {
  quiz_id: string
  score: number
  passed: boolean
  total_questions: number
  correct_answers: number
  feedback: Record<string, string>
}

export interface UserProgress {
  user_id: string
  total_chapters: number
  completed_chapters: number
  completion_percentage: number
  current_streak: number
  total_streak: number
  quiz_scores: Array<{
    quiz_id: string
    score: number
    passed: boolean
    attempted_at: string
  }>
  chapters: ProgressRecord[]
}

export interface ProgressRecord {
  user_id: string
  chapter_id: string
  completed: boolean
  time_spent: number
  last_accessed: string
  score: number
}

export interface AccessResponse {
  has_access: boolean
  tier: string
  chapter_id: string
  is_premium: boolean
  message: string
}

export interface SearchResult {
  query: string
  results: Array<{
    type: string
    chapter_id: string
    section?: string
    context?: string
    match: string
  }>
  total_results: number
}

export interface HybridFeatureResponse {
  feature: string
  result: Record<string, any>
  cost: number
  tokens_used: number
}
