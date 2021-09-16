import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from './Payment'
import React from 'react'


function StripeContainer() {
  const PUBLIC_KEY = 'pk_test_51ItF8hKJPpUd9VtT2kqWUZKZETdmd6Ezj8hlOcyGd5PYjHbHZxCwrsmIBRy05wxn9dk3n2HVSgkjMGgl7Gwq2ZWd00yZgAQKvJ'

  const stripeTestPromise = loadStripe(PUBLIC_KEY)
  return (
    <Elements stripe = {stripeTestPromise}>
      <Payment/>
    </Elements> 
  )
}
export default StripeContainer
