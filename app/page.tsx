"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MinusCircle, PlusCircle, ShoppingCart, Check, Star, Truck, Shield, RotateCcw, Headphones } from "lucide-react"

// Mock product data
const product = {
  id: "prod_001",
  name: "Premium Wireless Headphones",
  description:
    "Experience crystal-clear sound with our premium wireless headphones. Features noise cancellation, 30-hour battery life, and comfortable over-ear design.",
  price: 149.00,
  variants: ["Black", "White", "Blue"],
  features: [
    "Active Noise Cancellation",
    "30-hour Battery Life",
    "Bluetooth 5.2",
    "Comfortable Memory Foam Ear Cups",
    "Voice Assistant Compatible",
  ],
  reviews: [
    { id: 1, author: "Alex M.", rating: 5, text: "Best headphones I've ever owned. The sound quality is incredible!" },
    {
      id: 2,
      author: "Sarah K.",
      rating: 4,
      text: "Very comfortable for long listening sessions. Battery life is impressive.",
    },
    { id: 3, author: "James P.", rating: 5, text: "The noise cancellation is a game changer for my daily commute." },
  ],
}

export default function LandingPage() {
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)

  const handleBuyNow = () => {
    // Pass product selection data via URL parameters
    const params = new URLSearchParams({
      productId: product.id,
      variant: selectedVariant,
      quantity: quantity.toString(),
      price: product.price.toString(),
      name: product.name,
    })

    router.push(`/checkout?${params.toString()}`)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.5)_100%)]"></div>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Headphones className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SonicWave</span>
            </div>
            {/* <Button variant="ghost" onClick={() => router.push("/checkout")} className="text-white hover:bg-white/20 relative">
              <ShoppingCart className="h-5 w-5" />
              {quantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {quantity}
                </span>
              )}
            </Button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden p-8 flex items-center justify-center h-[500px]">
                <div className="transform transition-transform duration-500 hover:scale-105">
                  <Image
                    src={`/headphones-${selectedVariant.toLowerCase()}.png`}
                    alt={`${product.name} - ${selectedVariant}`}
                    width={400}
                    height={400}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {product.variants.map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-16 h-16 rounded-full border-2 ${
                    selectedVariant === variant
                      ? "border-purple-500 ring-2 ring-purple-300"
                      : "border-gray-200 hover:border-gray-300"
                  } transition-all`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundColor:
                        variant.toLowerCase() === "black"
                          ? "#111"
                          : variant.toLowerCase() === "white"
                            ? "#f8f8f8"
                            : "#3b82f6",
                    }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            <div>
              <Badge className="mb-3 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
                New Release
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(128 reviews)</span>
              </div>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Color</h2>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Quantity</h2>
                <div className="flex items-center space-x-3 border rounded-md p-2 w-fit">
                  <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={increaseQuantity}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between py-2 text-lg">
                  <span>Price</span>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-lg">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between py-3 text-xl font-bold border-t mt-2">
                  <span>Total</span>
                  <span className="text-purple-600">${(product.price * quantity).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full text-lg py-6"
              size="lg"
              onClick={handleBuyNow}
              style={{
                background: "linear-gradient(to right, #8b5cf6, #3b82f6)",
                transition: "all 0.3s ease",
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3">
                <Truck className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <Shield className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <RotateCcw className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features & Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="p-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                  <ul className="space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Product features"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-6 p-4">
              <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Headphones className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SonicWave</span>
            </div>
            <div className="text-sm text-slate-400">© {new Date().getFullYear()} SonicWave. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
