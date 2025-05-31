import nodemailer from "nodemailer"

// Email templates
const emailTemplates = {
  approved: {
    subject: "Order Confirmation - Your Purchase is Complete!",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Order Confirmed!</h1>
        <p>Dear ${data.customer.fullName},</p>
        <p>Thank you for your purchase. Your order has been successfully processed.</p>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Product:</strong> ${data.product.name} (${data.product.variant})</p>
        <p><strong>Quantity:</strong> ${data.product.quantity}</p>
        <p><strong>Total:</strong> $${data.totals.total.toFixed(2)}</p>
        <p>We'll notify you when your order ships.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    `,
  },
  declined: {
    subject: "Payment Declined - Action Required",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F44336;">Payment Declined</h1>
        <p>Dear ${data.customer.fullName},</p>
        <p>We're sorry, but your payment for order ${data.orderId} was declined.</p>
        <h2>Order Details</h2>
        <p><strong>Product:</strong> ${data.product.name} (${data.product.variant})</p>
        <p><strong>Quantity:</strong> ${data.product.quantity}</p>
        <p><strong>Total:</strong> $${data.totals.total.toFixed(2)}</p>
        <p>Please check your payment details and try again, or contact your bank for more information.</p>
        <p><a href="#" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Try Again</a></p>
        <p>Need help? Contact our support team.</p>
      </div>
    `,
  },
  error: {
    subject: "Order Processing Error",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF9800;">Payment Processing Error</h1>
        <p>Dear ${data.customer.fullName},</p>
        <p>We encountered an error while processing your payment for order ${data.orderId}.</p>
        <h2>Order Details</h2>
        <p><strong>Product:</strong> ${data.product.name} (${data.product.variant})</p>
        <p><strong>Quantity:</strong> ${data.product.quantity}</p>
        <p><strong>Total:</strong> $${data.totals.total.toFixed(2)}</p>
        <p>This is a temporary issue on our end. Please try again later or contact our support team for assistance.</p>
        <p><a href="#" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Try Again</a></p>
        <p>We apologize for the inconvenience.</p>
      </div>
    `,
  },
}

// Create email transport
// NOTE: You need to add your Mailtrap credentials to the environment variables
export async function sendOrderEmail(data: any) {
  try {
    // Check if Mailtrap credentials are available
    if (!process.env.MAILTRAP_TOKEN || !process.env.MAILTRAP_SENDER_EMAIL) {
      console.log("Mailtrap credentials not found. Email would have been sent with the following data:", data)
      return
    }

    // Create transporter
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_TOKEN,
        pass: process.env.MAILTRAP_TOKEN,
      },
    })

    // Get template based on order status
    const template = emailTemplates[data.status]

    // Send email
    const info = await transport.sendMail({
      from: process.env.MAILTRAP_SENDER_EMAIL,
      to: data.customer.email,
      subject: template.subject,
      html: template.html(data),
    })

    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Email sending error:", error)
    // Don't throw error to prevent breaking the order flow
  }
}

// IMPORTANT: Add your Mailtrap credentials to the environment variables
// You need to set MAILTRAP_TOKEN and MAILTRAP_SENDER_EMAIL in your environment variables
// Example:
// MAILTRAP_TOKEN=your_mailtrap_token
// MAILTRAP_SENDER_EMAIL=from@example.com
