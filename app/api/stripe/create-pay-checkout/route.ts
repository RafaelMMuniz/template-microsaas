import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json();

  const price = process.env.STRIPE_PRODUCT_PRICE_ID

  if(!price) {
    return NextResponse.json({error: "Price not found"}, { status: 500 });
  }

  const metadata = {
    testeId,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price, 
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/`,
      ...(userEmail && { customer_email: userEmail }), // Adiciona o email do cliente se estiver presente
      metadata
    });

    if (!session.url) {
      return NextResponse.json({error: "Session URL not found"}, { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  }catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}



//ali no primeiro const
// tomar cuidado com o que vai ser retornado aqui, pois pessoas com habilidade de hacking
// podem conseguir acessar informações sensíveis, como o id do cliente, por exemplo
// e isso pode ser um problema de segurança, já que o id do cliente é o mesmo que o id do usuário no firebase