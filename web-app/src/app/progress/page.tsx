'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProgress } from '@/lib/api'

export default function ProgressPage() {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

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
      const data = await getProgress(userId)
      setProgress(data)
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading progress...</div>
  }

  if (!progress) {
    return <div className="min-h-screen flex items-center justify-center">No progress data found</div>
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
              <Link href="/quizzes" className="text-gray-600 hover:text-gray-900">Quizzes</Link>
              <Link href="/progress" className="text-blue-600 font-medium">Progress</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">{progress.completed_chapters}</div>
            <div className="text-gray-600 mt-2">Chapters Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600">{progress.completion_percentage}%</div>
            <div className="text-gray-600 mt-2">Course Complete</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600">{progress.current_streak}</div>
            <div className="text-gray-600 mt-2">Day Streak</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-orange-600">{progress.quiz_scores?.length || 0}</div>
            <div className="text-gray-600 mt-2">Quizzes Taken</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all" 
              style={{ width: `${progress.completion_percentage}%` }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2">{progress.completed_chapters} of {progress.total_chapters} chapters completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chapter Details</h2>
          <div className="space-y-3">
            {progress.chapters?.map((chapter: any) => (
              <div key={chapter.chapter_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{chapter.chapter_id}</span>
                  {chapter.completed && <span className="ml-2 text-green-600">✓ Completed</span>}
                </div>
                <div className="text-sm text-gray-600">
                  Score: {chapter.score}% | Time: {Math.round(chapter.time_spent / 60)}min
                </div>
              </div>
            ))}
          </div>
        </div>

        {progress.quiz_scores && progress.quiz_scores.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz History</h2>
            <div className="space-y-3">
              {progress.quiz_scores.map((quiz: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{quiz.quiz_id}</span>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-sm rounded ${quiz.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {quiz.score}%
                    </span>
                    <span className="text-sm text-gray-600">{new Date(quiz.attempted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
