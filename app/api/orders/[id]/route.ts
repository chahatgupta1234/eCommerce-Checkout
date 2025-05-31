import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("Fetching order with ID");
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Find order by ID
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    })

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch order" }, { status: 500 })
  }
}
