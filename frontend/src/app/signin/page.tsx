'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Errors {
  email: string
  password: string
}

const SignIn = () =>{
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({ email: '', password: ''})
  const router = useRouter()
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const newErrors: Errors = { email: '', password: '' }

  if (!email) newErrors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'

  if (!password) newErrors.password = 'Password is required'
  else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'

  setErrors(newErrors)

  if (!newErrors.email && !newErrors.password) {
    try {
      const res = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        
      })

      const data = await res.json()

      if (res.ok) {
        // localStorage.setItem("token", data.token)
        // console.log(localStorage.getItem("token"))
        document.cookie = `token=${data.token}; path=/; max-age=${60*60*24}`;
        router.push("/home")
      } else {
        if (data.message === 'Invalid credentials') {
          setErrors(prev => ({ ...prev, password: 'Wrong email or password' }));
        } else {
          alert(data.message || 'Sign in failed');
        }
      }
    } catch (error) {
  console.error(error)
}
    // catch (error) {
    //   alert('Server error')
    // }
  }
}

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2 space-x-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="white"
              >
                <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
              </svg>
            </div>
            <div className="text-2xl font text-black-400">LevelUp</div>
          </div>

          <h2 className="text-xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Sign In
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Assess your level, improve yourself, and connect with people at your level on Level Up
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="relative [500px] mx-[60px]">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative [500px] mx-[60px]">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.083.172-2.124.49-3.1M6.54 6.54A9.956 9.956 0 002 9c0 5.523 4.477 10 10 10a9.956 9.956 0 005.46-1.54M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <a href="/forgot-password" className="text-xs text-blue-500 hover:underline absolute bottom-[-20px] right-0 ">
              Forgot password?
            </a>
          </div>
           <div className="retaive [500px] mx-[60px]">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded mt-9"
          >
            Sign In
          </button></div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
        </div>

        <div className="flex items-center my-4 mx-[60px]">
          <div className="flex-grow border-t border-gray-300 border-dashed"></div>
           <span className="mx-2 text-gray-400">or</span>
           <div className="flex-grow border-t border-gray-300 border-dashed"></div>
         </div>
         <div className="relative [500px] mx-[60px]">
        <button onClick={() => window.location.href = "http://localhost:5000/auth/google"}
        className="w-full px-4 py-2 rounded bg-white border border-gray-300 flex items-center justify-center space-x-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 group transition-colors duration-200">
           
          <span className="text-purple-500 font-bold group-hover:text-white">G</span>
          <span className="text-gray-700 group-hover:text-white">Sign In with Google</span>
        </button>
        </div>
      </div>
    </div>
  )
}

export default SignIn;