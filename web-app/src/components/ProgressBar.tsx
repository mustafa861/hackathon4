export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      ></div>
    </div>
  )
}
