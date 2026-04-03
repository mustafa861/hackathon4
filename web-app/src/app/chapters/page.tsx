'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getChapters, checkAccess } from '@/lib/api'

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const storedId = localStorage.getItem('userId') || `user_${Date.now()}`
    localStorage.setItem('userId', storedId)
    setUserId(storedId)
  }, [])

  useEffect(() => {
    loadChapters()
  }, [])

  const loadChapters = async () => {
    try {
      const data = await getChapters()
      setChapters(data)
    } catch (error) {
      console.error('Failed to load chapters:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading chapters...</div>
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
              <Link href="/chapters" className="text-blue-600 font-medium">Chapters</Link>
              <Link href="/quizzes" className="text-gray-600 hover:text-gray-900">Quizzes</Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Chapters</h1>
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.chapter_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-600">Chapter {chapter.order}</span>
                    {chapter.is_premium && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Premium</span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mt-1">{chapter.title}</h2>
                  <p className="text-gray-600 mt-1">{chapter.description}</p>
                </div>
                <Link 
                  href={`/chapters/${chapter.chapter_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
