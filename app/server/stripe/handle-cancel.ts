import { db } from "@/app/lib/firebase";
import "server-only"
import Stripe from "stripe"

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  console.log("Subscription canceled")


  const customerId = event.data.object.customer
  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get()

  if (userRef.empty) {
    console.log("No user found for this customer ID")
    return
  }

  const userId = userRef.docs[0].id

  await db.collection("users").doc(userId!).update({
    subscriptionStatus: "inactive",
  }).catch((error) => {
    console.error("Error updating user subscription:", error);
  })
}