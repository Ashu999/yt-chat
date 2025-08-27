interface ErrorDisplayProps {
  healthError?: Error | null
  itemError?: Error | null
}

export function ErrorDisplay({ healthError, itemError }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
        <div className="text-red-600 text-lg font-semibold mb-2">Server Connection Failed</div>
        <div className="text-red-700 text-sm mb-4">
          {healthError ? `Health check failed: ${healthError.message}` : ''}
          {itemError ? `Item API failed: ${itemError.message}` : ''}
        </div>
        <div className="text-gray-600 text-xs">
          Make sure the server is running on http://localhost:8000
        </div>
      </div>
    </div>
  )
}