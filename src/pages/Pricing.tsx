import React from 'react'
import { SubscriptionCard } from '../components/subscription/SubscriptionCard'
import { stripeProducts } from '../stripe-config'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export function Pricing() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Unlock the full potential of CustodyX.AI
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-1 lg:max-w-md lg:mx-auto">
          {stripeProducts.map((product) => (
            <SubscriptionCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}