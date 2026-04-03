import Link from 'next/link'

export default function Navigation() {
  return (
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
            <Link href="/search" className="text-gray-600 hover:text-gray-900">Search</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
