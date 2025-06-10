import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, planId } = session.metadata!
  
  if (session.mode === 'subscription' && session.subscription) {
    // Create subscription record
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        stripe_subscription_id: session.subscription as string,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })

    if (error) {
      console.error('Error creating subscription:', error)
    }
  }

  // Create payment record
  await supabaseAdmin
    .from('payments')
    .insert({
      user_id: userId,
      amount_mad: (session.amount_total || 0) / 100,
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
    })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    // Update subscription status
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date(invoice.period_start * 1000).toISOString(),
        current_period_end: new Date(invoice.period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' : 'cancelled',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}