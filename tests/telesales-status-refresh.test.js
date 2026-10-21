import assert from 'node:assert/strict'
import reactQuery from 'react-query'

const { QueryClient, QueryObserver } = reactQuery
const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: Infinity } } })
let calls = 0
const queryFn = async () => ({ version: ++calls })
try {
  client.setQueryData(['SourceTelesale'], ['Nguồn khách'])
  await client.fetchQuery(['StatusTelesale'], queryFn)
  await client.invalidateQueries({ queryKey: ['StatusTelesale'], refetchInactive: true })
  assert.equal(client.getQueryData(['StatusTelesale']).version, 2)
  const observer = new QueryObserver(client, { queryKey: ['StatusTelesale'], queryFn, staleTime: Infinity })
  const unsubscribe = observer.subscribe(() => {})
  await client.invalidateQueries({ queryKey: ['StatusTelesale'], refetchInactive: true })
  assert.equal(observer.getCurrentResult().data.version, 3)
  assert.deepEqual(client.getQueryData(['SourceTelesale']), ['Nguồn khách'])
  unsubscribe()
  console.log('Sidebar status refresh passes for active and inactive queries; source cache stays separate.')
} finally {
  client.clear()
}
