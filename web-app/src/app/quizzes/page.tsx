'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getQuizzes } from '@/lib/api'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes()
      setQuizzes(data)
    } catch (error) {
      console.error('Failed to load quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading quizzes...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">Course Companion FTE</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/chapters" className="text-gray-600 hover:text-gray-900">Chapters</Link>
              <Link href="/quizzes" className="text-blue-600 font-medium">Quizzes</Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Practice Quizzes</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.quiz_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
                {quiz.is_premium && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Premium</span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{quiz.questions.length} questions - Passing score: {quiz.passing_score}%</p>
              <Link 
                href={`/quizzes/${quiz.quiz_id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
