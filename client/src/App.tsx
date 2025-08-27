import { useQuery } from '@tanstack/react-query'
import { serverApi } from './lib/api'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorDisplay } from './components/ErrorDisplay'
import { ServerStatus } from './components/ServerStatus'

function App() {
  const { data: healthData, isLoading: healthLoading, error: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: serverApi.getHealth,
    retry: 3,
    retryDelay: 1000,
  })

  const { data: itemData, isLoading: itemLoading, error: itemError } = useQuery({
    queryKey: ['item', 1],
    queryFn: () => serverApi.getItem(1, 'test'),
    retry: 3,
    retryDelay: 1000,
  })

  const hasErrors = healthError || itemError
  const isLoading = healthLoading || itemLoading

  if (isLoading) {
    return <LoadingSpinner message="Connecting to server..." />
  }

  if (hasErrors) {
    return <ErrorDisplay healthError={healthError} itemError={itemError} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ServerStatus healthData={healthData} itemData={itemData} />
      </div>
    </div>
  )
}

export default App
