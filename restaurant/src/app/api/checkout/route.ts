//api/checkout/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing!");
} else {
  console.log("✅ Stripe API Key Loaded");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

// Create Stripe checkout session (POST)

export async function POST(req: Request) {
  try {
    const { amount, scheduled } = await req.json(); // add scheduled to the json data.

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    let successUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`;

    if (scheduled) {
      successUrl += '&scheduled=true';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Restaurant Bill" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Fetch session details by session_id (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      email: session.customer_details?.email || "",
      name: session.customer_details?.name || "",
    });
  } catch (error) {
    console.error("❌ Error fetching session details:", error);
    return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 });
  }
}
