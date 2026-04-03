import Link from 'next/link'

interface ChapterCardProps {
  chapter: {
    chapter_id: string
    title: string
    description: string
    order: number
    is_premium: boolean
  }
  completed?: boolean
}

export default function ChapterCard({ chapter, completed }: ChapterCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600">Chapter {chapter.order}</span>
            {chapter.is_premium && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Premium</span>
            )}
            {completed && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Completed</span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mt-1">{chapter.title}</h2>
          <p className="text-gray-600 mt-1">{chapter.description}</p>
        </div>
        <Link
          href={`/chapters/${chapter.chapter_id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {completed ? 'Review' : 'Start Learning'}
        </Link>
      </div>
    </div>
  )
}
