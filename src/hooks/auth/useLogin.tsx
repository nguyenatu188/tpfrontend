import { useState } from "react"
import { useAuthContext } from "../../context/AuthContext"

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error)
      }
      setAuthUser(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
