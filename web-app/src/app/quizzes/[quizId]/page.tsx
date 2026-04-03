'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuiz, submitQuiz, updateProgress, checkAccess } from '@/lib/api'

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const storedId = localStorage.getItem('userId') || `user_${Date.now()}`
    localStorage.setItem('userId', storedId)
    setUserId(storedId)
  }, [])

  useEffect(() => {
    if (userId) {
      loadQuiz()
    }
  }, [userId])

  const loadQuiz = async () => {
    try {
      const data = await getQuiz(quizId)
      const accessCheck = await checkAccess(userId, data.chapter_id)
      
      if (data.is_premium && !accessCheck.has_access) {
        router.push('/chapters')
        return
      }
      
      setQuiz(data)
    } catch (error) {
      console.error('Failed to load quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionIndex + 1}`]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz(quizId, answers)
      setResults(result)
      setShowResults(true)
      
      await updateProgress(userId, {
        chapter_id: quiz.chapter_id,
        score: result.score
      })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center">Quiz not found</div>
  }

  if (showResults && results) {
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
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
              <div className={`text-6xl font-bold mb-4 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.score}%
              </div>
              <p className={`text-xl ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.passed ? 'Congratulations! You passed!' : 'Keep practicing - you can do better!'}
              </p>
              <p className="text-gray-600 mt-2">
                {results.correct_answers} out of {results.total_questions} correct
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(results.feedback).map(([qId, feedback]) => (
                <div key={qId} className={`p-4 rounded-lg ${feedback.toString().startsWith('Correct') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium text-gray-900">{quiz.questions[parseInt(qId.replace('q', '')) - 1]?.question}</p>
                  <p className={`mt-2 ${feedback.toString().startsWith('Correct') ? 'text-green-700' : 'text-red-700'}`}>{feedback as string}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentQuestion(0)
                  setAnswers({})
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retake Quiz
              </button>
              <Link href="/quizzes" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Back to Quizzes
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[`q${currentQuestion + 1}`] === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)})</span> {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
