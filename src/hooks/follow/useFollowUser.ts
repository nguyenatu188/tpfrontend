import { useCallback, useState } from "react"

export const useFollowUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const follow = useCallback(async (userId: string) => {

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi khi theo dõi')

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { follow, loading, error }
}
