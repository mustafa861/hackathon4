import Link from 'next/link'

interface QuizCardProps {
  quiz: {
    quiz_id: string
    title: string
    questions: Array<any>
    passing_score: number
    is_premium: boolean
  }
}

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
  )
}
