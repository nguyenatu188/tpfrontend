import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"

type AuthUserType = {
  id: string
  fullname: string
  username: string
  email: string
  gender: string
  avatarUrl: string
  followersCount?: number
  followingCount?: number
}

const AuthContext = createContext<{
  authUser: AuthUserType | null
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>
  isLoading: boolean
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children } : {children:ReactNode}) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
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
        setIsLoading(false)
      }
    }

    fetchAuthUser()
  }, [authUser])

  return (
    <AuthContext.Provider
      value = {{
        authUser,
        isLoading,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}