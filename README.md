# 🛍️ Vaniga - Modern E-commerce Platform

Vaniga is a full-stack e-commerce application built with a focus on security, performance, and seamless user experience. It features a robust JWT-based authentication system, real-time cart management, and integrated payment processing.

---

## 🚀 Live Demo

- **Frontend:** https://vaniga.vercel.app  
- **Backend API:** https://vaniga.onrender.com  

---

## ✨ Key Features

- 🔐 **Secure Authentication:** JWT-based auth using HTTP-only cookies and an auto-refresh token mechanism (infinite-loop protected).  
- 🛒 **Cart Management:** Real-time cart updates with persistence in PostgreSQL via Prisma.  
- 💳 **Payment Integration:** Seamless checkout flow integrated with Cashfree Payment Gateway.  
- 📦 **Order Tracking:** Detailed order history with automated status updates.  
- 📧 **Automated Invoicing:** Email confirmation with order details sent automatically upon successful payment.  
- 📱 **Responsive Design:** Fully optimized for mobile, tablet, and desktop using Tailwind CSS.  
- 🛠️ **Robust Error Handling:** Advanced Axios interceptors to manage session expiry and unauthorized access.  

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS + Lucide React (Icons)   
- **API Client:** Axios (with custom interceptors for token refreshing)  

### Backend
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Language:** TypeScript  
- **ORM:** Prisma  
- **Database:** PostgreSQL (Hosted on Render/Neon)  
- **Authentication:** JWT (Access & Refresh Tokens)  
- **Communication:** Nodemailer (Brevo SMTP)  

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/vaniga.git
cd vaniga
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create .env file in the backend folder

```bash
DATABASE_URL="your_postgresql_url"
JWT_ACCESS_SECRET="your_secret"
JWT_REFRESH_SECRET="your_other_secret"
CASHFREE_APP_ID="your_cashfree_id"
CASHFREE_SECRET_KEY="your_cashfree_secret"
EMAIL_USER="your_gmail"
EMAIL_PASS="your_app_password"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

#### Run migrations and start:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Create a .env file in the frontend folder:
```bash
VITE_API_URL="http://localhost:5000/api/v1"
```

#### Start the development server:
```bash
npm run dev
```

---

### 🔒 Security Features Implemented

- **HTTP-Only Cookies:** Prevents XSS attacks by storing tokens outside of JavaScript reach.

- **CORS Configuration:** Strictly limited to authorized origins.

- **Database Transactions:** Uses Prisma $transaction (Serializable level) to ensure cart clearing and order creation happen together or not at all.

- **Token Interceptors:** Smart logic to handle 401 Unauthorized errors and session refreshing without UI flickering.

---

By 
Praveen Kumar V

