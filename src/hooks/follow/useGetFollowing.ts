import { useState, useCallback } from "react"

type Following = {
  id: string
  username: string
  fullname: string
  avatarUrl?: string
  followedAt: string
}

export const useGetFollowing = () => {
  const [following, setFollowing] = useState<Following[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowing = useCallback(async () => {

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/users/following', {
        credentials: 'include',
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Lỗi khi tải danh sách')
      
      setFollowing(data.data)
      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchFollowing()
  }, [fetchFollowing])

  return { following, loading, error, refetch }
}
