import React, { useState } from "react"
import { FaArrowCircleLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
import useLogin from "../hooks/useLogin"
import { GoogleLogin } from "@react-oauth/google"
import { useAuthContext } from "../context/AuthContext"
import FacebookLogin from '@greatsumini/react-facebook-login'

const Login = () => {
  const { setAuthUser } = useAuthContext()
  const { login, loading } = useLogin()
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(inputs.username, inputs.password)
  }

  const handleFacebookLogin = async (response: { accessToken: string; userID: string }) => {
    try {
      const res = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          accessToken: response.accessToken,
          userID: response.userID
        })
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
  
      setAuthUser(data);
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  }

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/src/assets/authBG.png')" }}
    >
      <Link to="/">
        <FaArrowCircleLeft className="text-[#1A77F2] absolute top-5 mx-5 w-[40px] h-[40px] hover:text-[#1899d6] cursor-pointer transition" />
      </Link>
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset relative w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="text-[#1A77F2] absolute top-[-50px] text-3xl font-bold fieldset-legend">
              Login
            </legend>

            <label className="fieldset-label">Username</label>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="Username"
              value={inputs.username}
              onChange={handleChange}
              required
            />

            <label className="fieldset-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              required
            />

            <Link to="/forgetpassword" className="cursor-pointer my-3 flex items-start">
              Forget your password?
            </Link>

            <button
              type="submit"
              className="btn btn-neutral w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </fieldset>
        </form>

        <div className="divider divider-neutral w-72 mx-auto text-[#1A77F2] font-bold">
          OR
        </div>

        <div className="flex flex-col gap-4">

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch("/api/auth/google", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    credential: credentialResponse.credential
                  })
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error)

                setAuthUser(data)

              } catch (error) {
                console.error("Google login error:", error)
              }
            }}
            onError={() => console.log("Google login thất bại")}
          />

          <FacebookLogin
            appId= {import.meta.env.VITE_FACEBOOK_APP_ID}
            onSuccess={handleFacebookLogin}
            onFail={(error) => {
              console.log('Facebook login failed:', error);
            }}
            onProfileSuccess={(response) => {
              console.log('Got Facebook profile:', response);
            }}
            scope="email, public_profile"
            render={({ onClick }) => (
              <button 
                onClick={onClick}
                className="btn bg-[#1A77F2] text-white border-[#005fd8] w-full"
              >
                <svg
                  aria-label="Facebook logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="white"
                    d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                  />
                </svg>
                Login with Facebook
              </button>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
