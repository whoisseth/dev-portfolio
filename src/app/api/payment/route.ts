import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: NextRequest) {
  try {
    console.log("Received request");

    const requestBody = await request.json();
    console.log("Parsed request body:", requestBody);

    const { amount, currency } = requestBody;

    console.log("Amount:", amount);
    console.log("Currency:", currency);

    if (!amount || typeof amount !== "number" || amount <10) {
      console.log("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!currency || currency !== "INR") {
      console.log("Invalid currency:", currency);
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: currency,
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    console.log("Razorpay order options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Created Razorpay order:", order);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error in API route:", error);

    let errorMessage = "Error processing request";
    if (error instanceof Error) {
      errorMessage += `: ${error.name} - ${error.message}`;
      console.error(error.stack);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
