import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"

const useRegister = () => {
  const [isLoading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const register = async (inputs: { fullname: string, username: string, email: string, gender: string, password: string }) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error)
      }
      setAuthUser(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error.message)
    } finally {
    setLoading(false)
    }
  }
  return { isLoading, register }
  }

export default useRegister
