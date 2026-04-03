'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getChapter, getChapterNavigation, checkAccess, updateProgress } from '@/lib/api'

export default function ChapterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chapterId = params.chapterId as string
  
  const [chapter, setChapter] = useState<any>(null)
  const [navigation, setNavigation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)
  const [userId, setUserId] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem('userId') || `user_${Date.now()}`
    localStorage.setItem('userId', storedId)
    setUserId(storedId)
    setStartTime(new Date())
  }, [])

  useEffect(() => {
    if (userId && chapterId) {
      loadChapter()
    }
  }, [userId, chapterId])

  const loadChapter = async () => {
    try {
      const accessCheck = await checkAccess(userId, chapterId)
      setHasAccess(accessCheck.has_access)
      
      if (accessCheck.has_access) {
        const [chapterData, navData] = await Promise.all([
          getChapter(chapterId),
          getChapterNavigation(chapterId)
        ])
        setChapter(chapterData)
        setNavigation(navData)
      }
    } catch (error) {
      console.error('Failed to load chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async () => {
    if (!userId || !chapterId || !startTime) return
    
    const timeSpent = Math.round((Date.now() - startTime.getTime()) / 1000)
    await updateProgress(userId, {
      chapter_id: chapterId,
      completed: true,
      time_spent: timeSpent
    })
    
    if (navigation?.next) {
      router.push(`/chapters/${navigation.next.chapter_id}`)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading chapter...</div>
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Content</h2>
          <p className="text-gray-600 mb-6">This chapter requires a Premium subscription.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Upgrade to Premium
          </Link>
        </div>
      </main>
    )
  }

  if (!chapter) {
    return <div className="min-h-screen flex items-center justify-center">Chapter not found</div>
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
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{chapter.title}</h1>
          <p className="text-gray-600 mb-8">{chapter.description}</p>

          {chapter.content.map((section: any, index: number) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.section}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{section.text}</p>
              
              {section.code_examples && section.code_examples.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  {section.code_examples.map((example: any, idx: number) => (
                    <div key={idx}>
                      <div className="text-sm text-gray-400 mb-2">{example.language}</div>
                      <pre className="text-green-400 overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
              
              {section.key_points && section.key_points.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Key Points:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {section.key_points.map((point: string, idx: number) => (
                      <li key={idx} className="text-blue-800">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between mt-8 pt-8 border-t">
            {navigation?.previous ? (
              <Link 
                href={`/chapters/${navigation.previous.chapter_id}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous: {navigation.previous.title}
              </Link>
            ) : (
              <div></div>
            )}
            <button
              onClick={markComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete & Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
