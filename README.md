# 🎉 Mini eCommerce Checkout Flow - Assignment Submission

## 📅 Overview

This project is a full-stack simulation of a real-world eCommerce checkout flow, built as a coding test assignment. It includes:

* Landing Page
* Checkout Page
* Thank You Page

The solution demonstrates:

* Advanced form validation
* Backend API integration
* Database persistence
* Transaction simulation (success, failure, error)
* Dynamic email notifications via Mailtrap

---

## 💪 Tech Stack Used

### 🔍 Frontend

* **Framework:** Next.js 14 (App Router, Server Actions)
* **Styling:** Tailwind CSS
* **State Management:** URL Params, Form Inputs
* **Validation:** HTML5 + custom logic in backend (e.g., future expiry, 16-digit card check)

### 🧱 Backend

* **Server:** Next.js API Routes + Server Actions
* **Email:** Nodemailer with Mailtrap
* **Database:** PostgreSQL with Prisma ORM

### 📧 Email Handling

* **Mailtrap.io (Sandbox Mode)**
* Email templates dynamically rendered based on transaction outcome
* Sends confirmation or failure emails with full details

---

## 📅 Features Implemented

### ✅ Landing Page

* Static product display (from JSON/mock DB)
* Variant and quantity selector
* Redirects to `/checkout` with query params

### ✅ Checkout Page

* Full form with validations:

  * Email format, phone number check
  * Card validations (16-digit, expiry in future, 3-digit CVV)
* Dynamically generated Order Summary from query
* Simulates transaction based on CVV:

  * `1`: Approved
  * `2`: Declined
  * `3`: Gateway Failure
* On submit:

  * Generates unique order ID
  * Stores customer + order details in DB
  * Sends dynamic email
  * Redirects to Thank You page with orderId

### ✅ Thank You Page

* Displays order details, customer info, and confirmation message
* Fetches all data from DB (not browser storage)

### ✅ Email Functionality

* Uses Mailtrap sandbox to simulate email delivery
* Email templates:

  * Approved: Order confirmation with summary
  * Declined: Error + retry instructions
  * Error: Payment processing failure

### 🔒 Advanced/Bonus

* Server-side error handling to avoid crashing user flow
* Unique order ID with UUID
* Transaction simulator via CVV logic
* Environment variable handling

---

## 🗋 Environment Variables (.env)

```
DATABASE_URL=<your_postgres_connection_string>
MAILTRAP_TOKEN=<your_mailtrap_username>
MAILTRAP_PASS=<your_mailtrap_password>
MAILTRAP_SENDER_EMAIL=<you@example.com>
```

---

## 🚀 Deployment

* Deployed on **Vercel**: [Live Demo Link](https://e-commerce-checkout-eight.vercel.app/)
* GitHub Repository: [GitHub Link](https://github.com/chahatgupta1234/eCommerce-Checkout)

---

## 🌐 Pages Summary

### `/` - Landing Page

* Product display, variant + quantity selectors

### `/checkout` - Checkout Form

* Full form inputs + order summary + validations

### `/thank-you?orderId=...` - Confirmation Page

* Order + customer summary fetched from DB

---

## ❓ Anything Missing?

**No. All mandatory features and advanced expectations have been implemented.**

* ✅ Transaction simulation
* ✅ Email logic with multiple outcomes
* ✅ Backend + DB integration
* ✅ UI flow from product selection to final receipt

### Optional Improvements (if time allowed):

* Stripe API for real payment simulation
* Session cart management
* Product inventory limit handling

---

## 🙏 Hiring Note

This project showcases my full-stack development skills, attention to detail, and ability to simulate real-world eCommerce logic with graceful error handling, database integration, and dynamic communication through email.

Looking forward to contributing to your team with production-level expertise and reliability.
