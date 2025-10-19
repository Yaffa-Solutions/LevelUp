'use client'
import { useState, useEffect } from 'react'
import UserCard from "../components/userCard"

interface Resource {
  title: string
  link: string
  type: string
}

interface Plan {
  id: string
  plan_name: string
  content: string
  started_time: string
  end_time: string
  active: boolean
  recommended_resource: Resource[]

}

const PlanPage = () =>{
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plans/me`, {
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: 'include'
          
        })
        const data = await res.json()

        // const mappedPlans = data.map((p ) => ({
        const mappedPlans = (data as Plan[]).map((p) => ({
          ...p,
          recommended_resource: typeof p.recommended_resource === "string"
            ? JSON.parse(p.recommended_resource)
            : p.recommended_resource || [],
        }))

        const activePlan = mappedPlans.find((p: Plan) => p.active)
        const otherPlans = mappedPlans.filter((p: Plan) => !p.active)
        otherPlans.sort((a: Plan, b: Plan) => new Date(b.started_time).getTime() - new Date(a.started_time).getTime())
        const sortedPlans = activePlan ? [activePlan, ...otherPlans] : otherPlans

        setPlans(sortedPlans)
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-[40px] mt-7 mb-7">
        <UserCard />

        <section className="flex-1 flex flex-col gap-4 mr-0 sm:mr-27">
          {plans.length === 0 && (
            <p className="text-gray-600 text-center">No plans available</p>
          )}

          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-sm p-6 relative cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.active && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{plan.plan_name}</h2>
              <p className="text-gray-500 text-sm mt-2">{plan.content}</p>
              <p className="text-gray-400 text-xs mt-1">
                Start: {new Date(plan.started_time).toLocaleDateString()} - End: {new Date(plan.end_time).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center z-50 "
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[500px] max-h-[80vh] overflow-y-auto relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedPlan(null)}
            >
              ×
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">{selectedPlan.plan_name}</h2>
            <p className="text-gray-700 mb-4">{selectedPlan.content}</p>

            {Array.isArray(selectedPlan.recommended_resource) &&
              selectedPlan.recommended_resource.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Recommended Resources</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPlan.recommended_resource.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r.link}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {r.title} ({r.type})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <p className="text-gray-400 text-xs mt-2">
              Start: {new Date(selectedPlan.started_time).toLocaleDateString()} - End: {new Date(selectedPlan.end_time).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanPage;