"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertTriangle, Loader2, Home } from "lucide-react"

// Order status types
type OrderStatus = "approved" | "declined" | "error"

// Order data type
interface OrderData {
  _id: string
  customer: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
  }
  payment: {
    last4: string
    expiryDate: string
  }
  product: {
    id: string
    name: string
    variant: string
    quantity: number
    price: number
  }
  totals: {
    subtotal: number
    tax: number
    total: number
  }
  status: OrderStatus
  createdAt: string
}

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("No order ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading your order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "Could not find order details"}</p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    )
  }

  // Status icon and message based on order status
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="h-12 w-12 text-green-500 mb-4" />,
      title: "Order Confirmed!",
      message: "Thank you for your purchase. Your order has been successfully processed.",
    },
    declined: {
      icon: <XCircle className="h-12 w-12 text-destructive mb-4" />,
      title: "Payment Declined",
      message: "Your payment was declined. Please check your payment details and try again.",
    },
    error: {
      icon: <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />,
      title: "Gateway Error",
      message: "We encountered an error processing your payment. Please try again later or contact support.",
    },
  }

  const { icon, title, message } = statusConfig[order.status]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-8">
        {icon}
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order Details</span>
            <span className="text-sm font-normal">Order #{order._id.slice(-8)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Product</h3>
              <div className="flex justify-between">
                <div>
                  <p>{order.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.product.variant} × {order.product.quantity}
                  </p>
                </div>
                <p>${(order.product.price * order.product.quantity).toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p>{order.customer.fullName}</p>
                  <p>{order.customer.email}</p>
                  <p>{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shipping Address</p>
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} {order.customer.zip}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Payment</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Method</p>
                  <p>Card ending in {order.payment.last4}</p>
                  <p>Expires {order.payment.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Summary</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
}
