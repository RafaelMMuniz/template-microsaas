import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try{
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")
    console.log("Webhook body:", body)

    if (!signature || !secret) {
      return new Response("No signature", { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)
    console.log("Webhook event:", event)
  
    switch (event.type) {
      case "checkout.session.completed": // Payment succeeded
        const metadata = event.data.object.metadata
  
        if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID){
          await handleStripePayment(event)
        }
        if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID){
          await handleStripeSubscription(event)
        }
  
        break;
  
      case "checkout.session.expired": // Payment expired
        console.log("Payment expired")
        break
      
      case "checkout.session.async_payment_succeeded": // Boleto payment succeeded
        console.log("Boleto payment succeeded")
        break
  
      case "checkout.session.async_payment_failed": // Boleto payment failed
        console.log("Boleto payment failed")
        break
      
      case "customer.subscription.updated": // Subscription updated
        console.log("Subscription updated")
        break
      
      case "customer.subscription.deleted": // Subscription canceled
        await handleStripeCancelSubscription(event)
        break
        
      case "customer.subscription.created": // Subscription created
        console.log("Subscription created")
        break
      
      default:
        console.log(`Unhandled event type ${event.type}`)
        break
    }

    return NextResponse.json({ message:" webhook uhu"}, { status: 200 })
  } catch (error) {
    console.error("Error handling webhook event:", error)
    return new Response("Webhook Error", { status: 500 })
  }
 
} 