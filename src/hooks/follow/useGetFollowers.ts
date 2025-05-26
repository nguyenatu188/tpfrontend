import { useState, useCallback } from "react"

type Follower = {
  id: string
  username: string
  fullname: string
  avatarUrl?: string
  followedAt: string
}

export const useGetFollowers = () => {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowers = useCallback(async () => {

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/users/followers', {
        credentials: 'include',
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Lỗi khi tải danh sách')
      
      setFollowers(data.data)
      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchFollowers()
  }, [fetchFollowers])

  return { followers, loading, error, refetch }
}
