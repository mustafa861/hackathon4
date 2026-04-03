'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProgress } from '@/lib/api'

export default function Home() {
  const [userId, setUserId] = useState('')
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem('userId') || `user_${Date.now()}`
    localStorage.setItem('userId', storedId)
    setUserId(storedId)
  }, [])

  useEffect(() => {
    if (userId) {
      loadProgress()
    }
  }, [userId])

  const loadProgress = async () => {
    try {
      setLoading(true)
      const data = await getProgress(userId)
      setProgress(data)
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Course Companion FTE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/chapters" className="text-gray-600 hover:text-gray-900">Chapters</Link>
              <Link href="/quizzes" className="text-gray-600 hover:text-gray-900">Quizzes</Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn AI Agent Development
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your 24/7 Digital Tutor - 168 hours per week at 99% cost savings
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your progress...</div>
        ) : progress ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{progress.completed_chapters}/{progress.total_chapters}</div>
                <div className="text-sm text-gray-500">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{progress.completion_percentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{progress.current_streak}</div>
                <div className="text-sm text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{progress.quiz_scores?.length || 0}</div>
                <div className="text-sm text-gray-500">Quizzes Taken</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress.completion_percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/chapters" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Course Chapters</h3>
            <p className="text-gray-600">10 comprehensive chapters from basics to advanced topics</p>
          </Link>
          <Link href="/quizzes" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Practice Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with interactive quizzes</p>
          </Link>
          <Link href="/progress" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and achievements</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
