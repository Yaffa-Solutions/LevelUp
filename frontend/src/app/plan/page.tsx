'use client'
import { useState, useEffect } from 'react'

export default function PlanPage() {
  const [plan, setPlan] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyPlan() {
      try {
        const res = await fetch("http://localhost:5000/plans/me", {
          credentials: 'include', 
        })
        const data = await res.json()
        setPlan(data[0] || null) 
        const userRes = await fetch("http://localhost:5000/user/me", {
          credentials: 'include',
        })
        const userData = await userRes.json()
        setUser(userData)

      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMyPlan()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        <aside className="bg-white rounded-2xl shadow-sm w-full md:w-1/4 p-6 flex flex-col items-center">
          {user ? (
            <>
              <Image
                src={user.profil_picture || "/avatar-placeholder.png"}
                alt="User"
                width={80}
                height={80}
                className="rounded-full mb-3"
              />
              <h2 className="font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {user.job_title || "No Job Title"}
              </p>

              <div className="space-y-3 text-sm w-full">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-medium">{user.level?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal</span>
                  <span className="font-medium">Next Level</span>
                </div>
              </div>

              {!plan && (
                <p className="mt-6 text-sm text-red-500 text-center">
                  You don't have a learning plan yet. Go to the chat and evaluate your skills.
                </p>
              )}
            </>
          ) : (
            <p>Loading user...</p>
          )}
        </aside>

        {/* Right Section: Active Plan */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm p-8">
          {plan ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {plan.plan_name}
              </h1>
              <p className="text-sm text-gray-500 mb-6">{plan.content}</p>

              {plan.recommended_resource && plan.recommended_resource.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Recommended Resources
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {plan.recommended_resource.map((r, i) => (
                      <a
                        key={i}
                        href={r.link}
                        className="flex flex-col justify-center bg-gray-50 border rounded-xl p-3 w-[180px] hover:bg-gray-100 transition"
                      >
                        <p className="text-sm font-medium text-gray-800">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.type}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 text-center">
              No active plan to display.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
