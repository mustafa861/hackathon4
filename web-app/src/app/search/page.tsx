'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchContent } from '@/lib/api'
import SearchBar from '@/components/SearchBar'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true)
      const data = await searchContent(searchQuery)
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center text-xl font-bold text-gray-900">Course Companion FTE</Link>
            <div className="flex items-center space-x-4">
              <Link href="/chapters" className="text-gray-600 hover:text-gray-900">Chapters</Link>
              <Link href="/quizzes" className="text-gray-600 hover:text-gray-900">Quizzes</Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress</Link>
              <Link href="/search" className="text-blue-600 font-medium">Search</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Course Content</h1>
        <div className="mb-8">
          <SearchBar />
        </div>

        {loading && <div className="text-center py-8">Searching...</div>}

        {results && (
          <div>
            <p className="text-gray-600 mb-4">{results.total_results} results for "{results.query}"</p>
            {results.total_results === 0 ? (
              <div className="text-center py-8 text-gray-500">No results found. Try different keywords.</div>
            ) : (
              <div className="space-y-4">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{result.chapter_id}</span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{result.match}</span>
                    </div>
                    {result.section && (
                      <h3 className="font-semibold text-gray-900 mb-2">{result.section}</h3>
                    )}
                    {result.context && (
                      <p className="text-gray-700">...{result.context}...</p>
                    )}
                    {result.key_point && (
                      <p className="text-gray-700">Key Point: {result.key_point}</p>
                    )}
                    <Link
                      href={`/chapters/${result.chapter_id}`}
                      className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Chapter →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
