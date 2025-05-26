import { useAuthContext } from "../../context/AuthContext"
import { useState } from "react"

export const useUploadAvatar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { authUser, setAuthUser } = useAuthContext()

  const uploadAvatar = async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Chỉ chấp nhận file ảnh')
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Kích thước ảnh tối đa 10MB')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/users/profile/avatar', {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Upload thất bại')
      }

      // Cập nhật người dùng với avatar mới
      if (authUser) {
        setAuthUser({
          ...authUser,
          avatarUrl: data.avatarUrl
        })
      }
      
      return data.avatarUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { uploadAvatar, isLoading, error }
}
