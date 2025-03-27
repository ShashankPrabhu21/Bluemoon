// /app/api/createCheckoutSession/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});


export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received totalAmount:", body.totalAmount); // Debugging log

    if (!body.totalAmount || isNaN(body.totalAmount)) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Restaurant Bill" },
            unit_amount: Math.round(body.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    console.log("Stripe session created:", session.url); // Log session URL

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error); // Log detailed error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

