// src/pages/ForgotPassword.tsx
import React, { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessage(data.message || 'Check your email for the reset link.')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/src/assets/authBG.png')" }}
    >
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded bg-white shadow-md space-y-4">
          <h1 className="text-2xl text-custom text-center">Forget Password</h1>
          <p className="text-sm text-gray-600 text-center">Nhập email để nhận link reset mật khẩu</p>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
