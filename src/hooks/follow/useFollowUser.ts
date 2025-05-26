import { useCallback, useState } from "react"
import { useAuthContext } from "../../context/AuthContext"

export const useFollowUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { authUser } = useAuthContext()

  const follow = useCallback(async (userId: string) => {
    if (!authUser) {
      setError('Bạn cần đăng nhập để thực hiện thao tác này')
      return false
    }

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
  }, [authUser])

  return { follow, loading, error }
}
