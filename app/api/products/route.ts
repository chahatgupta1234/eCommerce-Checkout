import { NextResponse } from "next/server"

// Mock product data
const products = [
  {
    id: "prod_001",
    name: "Premium Wireless Headphones",
    description:
      "Experience crystal-clear sound with our premium wireless headphones. Features noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    variants: ["Black", "White", "Blue"],
    inventory: 500,
  },
]

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity } = body

    // Find product
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // Check inventory
    if (product.inventory < quantity) {
      return NextResponse.json({ success: false, message: "Insufficient inventory" }, { status: 400 })
    }

    // Update inventory (in a real app, this would update the database)
    product.inventory -= quantity

    return NextResponse.json({
      success: true,
      message: "Inventory updated",
      remainingInventory: product.inventory,
    })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 })
  }
}
