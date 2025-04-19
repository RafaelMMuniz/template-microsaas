"use client"

import { useStripe } from "@/app/hooks/useStripe";



export default function Pagamentos() {

  const {createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal} = useStripe()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <h1>Pagamentos</h1>
      <button className="border rounded-md px-1" onClick={() => createPaymentStripeCheckout({
        testeId: "123",
      })}>Criar pagamento com stripe</button>
      <button className="border rounded-md px-1"onClick={() => createSubscriptionStripeCheckout({
        testeId: "123",
      })}>Criar assinatura com stripe</button>
      <button className="border rounded-md px-1" onClick={handleCreateStripePortal}>Criar portal de pagamento</button>
    </div>
  );
}