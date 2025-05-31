import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sendOrderEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extract data from request body
    const { customer, payment, product, totals, simulationCode } = body

    // Determine order status based on simulation code
    let status
    switch (simulationCode) {
      case "1":
        status = "approved"
        break
      case "2":
        status = "declined"
        break
      case "3":
        status = "error"
        break
      default:
        status = "approved" // Default to approved
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Create order in database
    const result = await db.collection("orders").insertOne({
      customer,
      payment,
      product,
      totals,
      status,
      createdAt: new Date().toISOString(),
    })

    // Send email notification
    await sendOrderEmail({
      orderId: result.insertedId.toString(),
      customer,
      product,
      totals,
      status,
    })

    // Simulate inventory update
    console.log(`Updating inventory for product ${product.id}, reducing by ${product.quantity}`)

    return NextResponse.json(
      {
        success: true,
        orderId: result.insertedId.toString(),
        status,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
  }
}
