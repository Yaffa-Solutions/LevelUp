'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const EmailVerification = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || '' 
  const [otp, setOtp] = useState<string[]>(['', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
    }
  }

  const handleVerify = async (code: string) => {
    try {
      const res = await fetch('http://localhost:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()

      if (res.ok) {
        router.push('/next-page')
      } else {
        alert(data.message)
        setOtp(['', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  const handleResend = async () => {
    await fetch('http://localhost:5000/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    setTimeLeft(60)
    setOtp(['', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-10">
      <div className="p-8 sm:p-12 rounded-lg w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="sm:w-1/2 mb-10 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Verify
              <br />
              Your Email
            </h1>
            <p className="text-gray-700 mt-4 text-lg">
              Please enter the 5-digit code that was sent to your email
            </p>
          </div>

          <div className="sm:w-[45%] p-6 sm:p-10 rounded-xl flex flex-col items-center justify-center border border-gray-100 shadow-lg">
            <h2 className="text-purple-600 font-semibold mb-6 text-base">Verification</h2>

            <div className="flex space-x-3 mb-6">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-10 h-14 text-3xl font-bold text-center border-b-2 border-gray-300 focus:border-b-4 focus:border-purple-500 rounded-none focus:outline-none transition duration-150"
                />
              ))}
            </div>

            <p className="text-gray-500 mb-4 text-sm">
              Resend code in <span className="font-semibold text-purple-600">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
            </p>

            <button
              disabled={timeLeft > 0}
              onClick={handleResend}
              className={`w-full max-w-xs py-3 rounded-full text-white font-medium transition duration-300 transform hover:scale-[1.02] 
                ${timeLeft > 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-purple-200/50'
                }`}
            >
              Send again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
