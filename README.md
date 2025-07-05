# Full-Stack Complaint Management System

## Project Overview
This is a comprehensive web application designed for managing complaints, featuring distinct user and administrative interfaces. It showcases full-stack development skills using modern web technologies, focusing on a clean, modern, and futuristic UI/UX.

## Features

### Core Functionality
*   **User Complaint Submission:**
    *   Clean and intuitive form for submitting complaints.
    *   Fields: Complaint Title, Description, Category (Product, Service, Support), Priority (Low, Medium, High).
    *   Form validation with clear feedback.
*   **Admin Complaint Management:**
    *   Admin dashboard to view and manage all complaints.
    *   Complaints Table: Displays Title, Category, Priority, Date Submitted, Status.
    *   Interactive Features: Update complaint status (Pending, In Progress, Resolved).
    *   **Filtering:** Filter complaints by Status and Priority (subtle UI).
*   **RESTful API Endpoints:**
    *   `POST /api/complaints`: Create new complaint.
    *   `GET /api/complaints`: Retrieve all complaints (supports filtering by status and priority).
    *   `GET /api/complaints/:id`: Get specific complaint details.
    *   `PUT /api/complaints/:id`: Update complaint status/details (admin-protected).
    *   `DELETE /api/complaints/:id`: Delete complaint (admin-protected).
    *   Includes proper HTTP status codes, input validation, and error handling.
*   **Email Notification System:**
    *   Sends email to admin on new complaint submission.
    *   Sends email to admin on complaint status update.
*   **JWT Authentication System:**
    *   User registration (`POST /api/auth/register`).
    *   User login (`POST /api/auth/login`).
    *   Protected routes for admin actions (update/delete complaints).
*   **Role-Based Access Control:**
    *   Normal users are redirected to the complaint submission page after login/registration.
    *   Admin users are redirected to the admin dashboard after login/registration.
    *   The "Submit Complaint" link is hidden for admin users.
    *   Admin users are restricted from accessing public routes (like login/register/submit complaint forms) when logged in.
*   **Theming:**
    *   Dark/Light mode toggle with persistence.
    *   Futuristic, minimal aesthetic with subtle animations and glowing effects.

## Tech Stack

*   **Frontend:** React.js
*   **Backend:** Node.js with Next.js API Routes
*   **Database:** MongoDB (with Mongoose ODM)
*   **Email Service:** NodeMailer
*   **Styling:** Custom CSS
*   **Authentication:** JSON Web Tokens (JWT) with `jsonwebtoken` and `bcryptjs`
*   **Version Control:** Git

## Project Structure

```
complaint-management-system/
├── backend/
│   ├── models/             # Mongoose schemas (e.g., User, Complaint)
│   ├── pages/api/          # Next.js API routes
│   │   ├── auth/           # Authentication endpoints (login, register)
│   │   └── complaints/     # Complaint CRUD endpoints
│   ├── lib/                # Utility functions (dbConnect, generateToken, email, upload)
│   ├── middleware/         # Express/Next.js middleware (CORS, authMiddleware)
│   ├── .env                # Environment variables (sensitive info)
│   └── package.json        # Backend dependencies and scripts
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components (e.g., PrivateRoute, PublicRoute)
│   │   ├── context/        # React Context for Auth and Theme management
│   │   ├── pages/          # React components for different routes (forms, dashboards)
│   │   └── index.css       # Global styles, theme variables, animations
│   ├── package.json        # Frontend dependencies and scripts
│   └── tailwind.config.js  # (Removed, but kept for historical context if needed)
│   └── postcss.config.js   # (Removed, but kept for historical context if needed)
└── README.md               # Project documentation
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (Node Package Manager)
*   MongoDB (local installation or MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd complaint-management-system
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables (`.env` Setup)

Create a `.env` file in the `backend/` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_SECURE=true_or_false # true for 465 (SSL), false for other ports (e.g., 587 for TLS)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
ADMIN_EMAIL=admin_recipient_email@example.com
```

*   **`MONGO_URI`**: Your MongoDB connection string. For MongoDB Atlas, it looks like `mongodb+srv://username:password@cluster0.mongodb.net/complaint-management`. For local, it might be `mongodb://localhost:27017/complaint-management`.
*   **`JWT_SECRET`**: A long, random, and complex string. **Do NOT share this publicly.** You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
*   **`JWT_EXPIRES_IN`**: Expiration time for JWTs (e.g., `1h`, `7d`).
*   **Email Configuration**: Fill in your SMTP server details. If using Gmail with 2FA, you'll need an "App password". `EMAIL_SECURE` should be `true` for port 465 (SSL) and `false` for port 587 (TLS/STARTTLS).
*   **`ADMIN_EMAIL`**: The email address where new complaint and status update notifications will be sent.

### Database Setup (Creating the Admin User)

For security, the application does not provide a public registration endpoint for admin users. You must manually create the first admin user directly in your MongoDB database.

1.  **Connect to your MongoDB database** (using MongoDB Compass, mongosh, or Atlas UI).
2.  **Hash your desired admin password.** You can use a temporary Node.js script:
    *   Create a file (e.g., `hash_password.js`) in your `backend/` directory:
        ```javascript
        const bcrypt = require('bcryptjs');
        async function hashPassword(password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          console.log(hashedPassword);
        }
        hashPassword("your_secure_admin_password"); // Replace with your actual password
        ```
    *   Run it: `node hash_password.js`
    *   Copy the outputted hash.
    *   **Delete `hash_password.js` after use.**
3.  **Insert a new user document** into your `users` collection (or update an existing one) with `isAdmin: true` and the hashed password:
    ```javascript
    db.users.insertOne({
      username: "admin",
      password: "PASTE_YOUR_HASHED_PASSWORD_HERE",
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    ```
    (Adjust collection name if different, e.g., `db.your_database_name.users.insertOne(...)`)

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend will run on `http://localhost:3000`.

2.  **Start the Frontend Server:**
    ```bash
    cd frontend
    npm start
    ```
    The frontend will run on `http://localhost:3001`.

## Testing API Endpoints (using Postman/cURL)

Ensure your backend server is running (`npm run dev`).

*   **Register User (POST):**
    *   URL: `http://localhost:3000/api/auth/register`
    *   Method: `POST`
    *   Headers: `Content-Type: application/json`
    *   Body: `{ "username": "testuser", "password": "password123" }`
*   **Login User (POST):**
    *   URL: `http://localhost:3000/api/auth/login`
    *   Method: `POST`
    *   Headers: `Content-Type: application/json`
    *   Body: `{ "username": "testuser", "password": "password123" }`
    *   *Note: Copy the `token` from the response for protected routes.*
*   **Get All Complaints (GET):**
    *   URL: `http://localhost:3000/api/complaints`
    *   Method: `GET`
    *   *Optional Query Params:* `?status=Pending` or `?priority=High`
*   **Update Complaint (PUT - Admin Protected):**
    *   URL: `http://localhost:3000/api/complaints/<complaint_id>`
    *   Method: `PUT`
    *   Headers: `Content-Type: application/json`, `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   Body: `{ "status": "In Progress" }`
*   **Delete Complaint (DELETE - Admin Protected):**
    *   URL: `http://localhost:3000/api/complaints/<complaint_id>`
    *   Method: `DELETE`
    *   Headers: `Authorization: Bearer <YOUR_JWT_TOKEN>`

## User Roles & Access

*   **Normal Users (and Logged Out):**
    *   Can access: Home (`/`), Submit Complaint (`/`), Login (`/login`), Register (`/register`).
    *   Cannot see "Admin Dashboard" link in navbar.
    *   If they try to navigate to `/admin` directly, they will be redirected to `/login`.
    *   After login/registration, they are redirected to the "Submit Complaint" page (`/`).
*   **Admin Users:**
    *   Can access: Admin Dashboard (`/admin`).
    *   Cannot see "Submit Complaint", "Login", or "Register" links in navbar.
    *   If they try to navigate to public routes (`/`, `/login`, `/register`) directly, they will be redirected to `/admin`.
    *   After login/registration, they are redirected to the "Admin Dashboard" page (`/admin`).

## Email Configuration

Ensure your `.env` file's email settings are correct. For services like Gmail, you might need to generate an "App password" if 2-Factor Authentication is enabled on your account, as direct password usage is often blocked.

## Deployment Strategy (High-Level)

*   **Database Hosting:** MongoDB Atlas (recommended for cloud-hosted MongoDB).
*   **Backend Deployment:** Platforms like Vercel, Railway, or Render are suitable for Next.js API routes.
*   **Frontend Deployment:** Platforms like Vercel or Netlify are excellent for React applications.
*   **Environment Variables:** Configure all `.env` variables directly on your chosen hosting platforms, especially `JWT_SECRET` and email credentials, for security.

---

This `README.md` provides a comprehensive overview of your project. Let me know if you'd like any adjustments or further assistance!
