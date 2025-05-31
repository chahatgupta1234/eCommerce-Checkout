"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
  cardNumber: z.string().regex(/^\d{16}$/, "Please enter a valid 16-digit card number"),
  expiryDate: z.string().refine((val) => {
    // Check if expiry date is in the future
    const [month, year] = val.split("/").map(Number)
    const now = new Date()
    const currentYear = now.getFullYear() % 100 // Get last 2 digits of year
    const currentMonth = now.getMonth() + 1 // getMonth() is 0-indexed

    return month >= 1 && month <= 12 && (year > currentYear || (year === currentYear && month >= currentMonth))
  }, "Please enter a valid expiry date (MM/YY) in the future"),
  cvv: z.string().regex(/^\d{3}$/, "Please enter a valid 3-digit CVV"),
  // This field is used to simulate different payment outcomes
  simulationCode: z.string().regex(/^[1-3]$/, "Please enter 1, 2, or 3 to simulate different outcomes"),
})

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get product data from URL parameters
  const productId = searchParams.get("productId") || ""
  const variant = searchParams.get("variant") || ""
  const quantity = Number.parseInt(searchParams.get("quantity") || "1")
  const price = Number.parseFloat(searchParams.get("price") || "0")
  const name = searchParams.get("name") || ""

  const subtotal = price * quantity
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      simulationCode: "1", // Default to success
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        payment: {
          last4: values.cardNumber.slice(-4),
          expiryDate: values.expiryDate,
        },
        product: {
          id: productId,
          name,
          variant,
          quantity,
          price,
        },
        totals: {
          subtotal,
          tax,
          total,
        },
        simulationCode: values.simulationCode,
      }

      // Submit order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Redirect to thank you page with order ID
      router.push(`/thank-you?orderId=${data.orderId}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Information</h3>

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (MM/YY)</FormLabel>
                            <FormControl>
                              <Input placeholder="12/25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <FormField
                      control={form.control}
                      name="simulationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Simulation Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 1, 2, or 3" {...field} maxLength={1} />
                          </FormControl>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enter 1 for success, 2 for decline, 3 for gateway error
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {variant} × {quantity}
                    </p>
                  </div>
                  <p>${(price * quantity).toFixed(2)}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
