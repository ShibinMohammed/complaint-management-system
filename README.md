# Full-Stack Complaint Management System

## Project Overview
A comprehensive web application for managing complaints, featuring distinct user and administrative interfaces with a clean, modern UI/UX. Includes JWT authentication, email notifications, and theming.

## Live Demo
[https://complaint-management-frontend-rouge.vercel.app](https://complaint-management-frontend-rouge.vercel.app)

## Features
*   **User Interface:** Submit complaints (title, description, category, priority).
*   **Admin Interface:** View, filter (status, priority), update status, and delete complaints.
*   **RESTful API:** CRUD operations for complaints and authentication.
*   **Email Notifications:** Sends emails to admin on new complaint submission and status updates.
*   **JWT Authentication:** User registration/login, role-based access control (normal users vs. admins).
*   **Theming:** Dark/Light mode toggle.

## Tech Stack
*   **Frontend:** React.js
*   **Backend:** Node.js with Next.js API Routes
*   **Database:** MongoDB (Mongoose ODM)
*   **Email Service:** NodeMailer
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **Styling:** Custom CSS

## Getting Started

### Prerequisites
*   Node.js (v14+) & npm
*   MongoDB (local or Atlas)

### Installation
1.  **Clone:** `git clone <your-repository-url>`
2.  **Navigate:** `cd complaint-management-system`
3.  **Install Backend:** `cd backend && npm install`
4.  **Install Frontend:** `cd ../frontend && npm install`

### Environment Variables (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_SECURE=true_or_false
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin_recipient_email@example.com
FRONTEND_URL=http://localhost:3001 # Or your deployed frontend URL
```

### Admin User Setup
Manually create the first admin user in your MongoDB database. Hash the password using `bcryptjs` (example script provided in original README).

### Running the Application
1.  **Start Backend:** `cd backend && npm run dev` (runs on `http://localhost:3000`)
2.  **Start Frontend:** `cd frontend && npm start` (runs on `http://localhost:3001`)

## Deployment
*   **Frontend:** Deployed on Vercel.
*   **Backend:** Suitable for Vercel (for Next.js API routes), Railway, or Render.
*   **Database:** MongoDB Atlas recommended.
*   **Environment Variables:** Configure on hosting platforms for security.