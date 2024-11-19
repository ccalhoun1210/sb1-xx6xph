import { useState } from "react"
import { Receipt, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { loadStripe } from "@stripe/stripe-js"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { BillingDetails, ServiceDetails } from "@/types/workOrder"
import { useToast } from "@/hooks/use-toast"

interface BillingInfoProps {
  billing: BillingDetails
  service: ServiceDetails
  onUpdate: (billing: BillingDetails) => void
}

export function BillingInfo({ billing, service, onUpdate }: BillingInfoProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const { toast } = useToast()

  const handleChange = (field: keyof BillingDetails, value: any) => {
    onUpdate({ ...billing, [field]: value })
  }

  const calculatePartsTotal = () => {
    return service.selectedParts.reduce((sum, part) => sum + part.price * part.quantity, 0)
  }

  const calculateLaborTotal = () => {
    return service.laborTime * service.laborRate
  }

  const calculateTotal = () => {
    return calculatePartsTotal() + calculateLaborTotal()
  }

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true)
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      // In a real app, create a payment intent on your server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Convert to cents
          currency: "usd",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = await response.json()

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real app, collect card details via Stripe Elements
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
          },
        },
      })

      if (result.error) {
        throw result.error
      }

      handleChange("paymentStatus", "paid")
      toast({
        title: "Payment Successful",
        description: "The payment has been processed successfully.",
      })
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      const invoiceData = {
        billing,
        service,
        partsTotal: calculatePartsTotal(),
        laborTotal: calculateLaborTotal(),
        total: calculateTotal(),
      }

      const pdfBlob = await generateInvoicePDF(invoiceData)
      const url = URL.createObjectURL(pdfBlob)
      window.open(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Invoice Summary</h3>
        <div className="space-y-2">
          {service.selectedParts.map(part => (
            <div key={part.id} className="flex justify-between text-sm">
              <span>{part.name} x{part.quantity}</span>
              <span>${(part.price * part.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Labor ({service.laborTime.toFixed(2)} hours @ ${service.laborRate}/hour)</span>
            <span>${calculateLaborTotal().toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceId">Invoice ID</Label>
          <Input
            id="invoiceId"
            value={billing.invoiceId}
            onChange={(e) => handleChange("invoiceId", e.target.value)}
            placeholder="Enter invoice ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select
            value={billing.paymentStatus}
            onValueChange={(value) => handleChange("paymentStatus", value)}
          >
            <SelectTrigger id="paymentStatus">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partiallyPaid">Partially Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Customer Signature</Label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          [Signature Pad Placeholder]
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerFeedback">Customer Feedback</Label>
        <Textarea
          id="customerFeedback"
          value={billing.customerFeedback}
          onChange={(e) => handleChange("customerFeedback", e.target.value)}
          placeholder="Enter customer feedback"
        />
      </div>

      <div className="space-y-2">
        <Label>Customer Rating</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= billing.customerRating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
              onClick={() => handleChange("customerRating", star)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex-1"
          onClick={handlePayment}
          disabled={isProcessingPayment || billing.paymentStatus === "paid"}
        >
          {isProcessingPayment ? "Processing..." : "Process Payment"}
        </Button>
        <Button className="flex-1" onClick={handleGenerateInvoice}>
          <Receipt className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
      </div>
    </div>
  )
}