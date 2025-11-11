'use client'
import { useState, FormEvent } from 'react'

interface Errors {
  email: string
}

const ForgotPassword = () =>{
  const [email, setEmail] = useState<string>('')
  const [errors, setErrors] = useState<Errors>({ email: '' })
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: Errors = { email: '' }

    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'

    setErrors(newErrors)

    if (!newErrors.email) {
      setIsSuccess(true)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-full md:w-96 lg:w-1/3 mx-4 sm:mx-4 md:mx-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2 space-x-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
              </svg>
            </div>
            <div className="text-2xl font text-black-400">LevelUp</div>
          </div>
          <h2 className="text-xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Reset password
          </h2>
          {/* "break-words whitespace-normal px-4" */}
          <p className="text-gray-400 text-sm mt-1 ">
            Quickly and securely recover your account by entering your email
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded mt-2"
          >
            Send password reset link
          </button>
        </form>
        {isSuccess && (
          <div className="text-center text-sm text-green-500 mt-4">
            A password reset link has been sent to your email
          </div>
        )}
        <div className="text-center text-sm text-gray-500 mt-4">
          <a href="/signin" className="text-blue-500">Sign In</a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;