# PACP (Poverty Alleviation Credit Platform)

PACP (Poverty Alleviation Credit Platform) is a banking-inspired web application that brings savings (RD/FD) and credit/loan facilities to underserved communities using a cooperative, member-first model.

Think of it like a community finance platform: members save, grow, and become eligible for transparent, fairly-priced loans.

**Note:** PACP is not a licensed bank. It's a cooperative-style credit & savings platform designed for inclusion and accessibility.

## Key Features

* Role-based Auth - Secure login/signup with JWT; roles for Admin and User
* Profile - View member details (ID, Name, Email, Phone, hasRD/hasFD/hasLoan)
* Deposits - Track Recurring Deposits (RD) and Fixed Deposits (FD)
* Credits/Loans - View loan details, EMI schedule, next due date, and status
* PDF Statements - Public, static sample PDF (client-side) + room for server-generated PDFs
* Admin Controls - Only Admin can update financial data for users
* Responsive UI - Clean, mobile-friendly React + Tailwind CSS
* Print Profile - One-click print of the user's profile card

## Tech Stack

**Frontend**
* React (Vite)
* Tailwind CSS
* Axios

**Backend**
* Node.js, Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)
* Cloudinary (Media Management)

**for server PDFs**
* EJS Templates, Puppeteer (server-side PDF generation)

## Project Structure

```

RootApp/
├── backend/
|---  node_modules/
      src/
        ┣ config
        ┃ ┗ cloudinary.js
        ┃ ┗ db.js
        ┣ controllers
        ┃ ┣ adminController.js
        ┃ ┣ authController.js
        ┃ ┣ fdController.js
        ┃ ┣ loanController.js
        ┃ ┣ printController.js
        ┃ ┣ rdController.js
        ┃ ┗ userController.js
        ┣ middleware
        ┃ ┣ authMiddlware.js
        ┃ ┗ validationMiddleware.js
        ┣ models
        ┃ ┣ FdModel.js
        ┃ ┣ LoanModel.js
        ┃ ┣ RdModel.js
        ┃ ┗ UserModel.js
        ┗ routes
        ┃ ┣ adminRoutes.js
        ┃ ┣ authRoutes.js
        ┃ ┣ fdRoutes.js
        ┃ ┣ loanRoutes.js
        ┃ ┣ printRoutes.js
        ┃ ┣ rdRoutes.js
        ┃ ┗ userRoutes.js
|     |-- tmp/
|     |-- views/
        |-- profile.ejs
|     |-- .env
|     |-- .env.sample
|     |-- package-lock.json
│     └── package.json 
│     ├── server.js                       //or index.js


├── frontend/
|   |-- node_modules
│   ├── public/
         |- sample-pdf.pdf
        src/
           ┣ components
           ┃ ┣ Footer.jsx
           ┃ ┣ Navbar.jsx
           ┣ context
           ┃ ┗ AuthContext.jsx
           ┃ ┗ ThemeContext.jsx
           ┣ layouts
           ┃ ┗ MainLayout.jsx
           ┣ pages
           ┃ ┣ adminView
           ┃ ┃ ┣ AdminDashboard.jsx
           ┃ ┃ ┣ AdminUserProfile.jsx
           ┃ ┃ ┣ FinanceOverview.jsx
           ┃ ┃ ┣ ManageUsers.jsx
           ┃ ┣ auth
           ┃ ┃ ┣ Login.jsx
           ┃ ┃ ┗ Signup.jsx
           ┃ ┣ AboutUs.jsx
           ┃ ┣ ContactUs.jsx
           ┃ ┣ Home.jsx
           ┃ ┣ PortFolio.jsx
           ┃ ┣ Schemes.jsx
           ┃ ┣ Services.jsx
           ┣ App.jsx
           ┣ index.css
           ┣ main.jsx
           ┗ utils.js
│   ├── .env
│   ├── .env.sample
|   |-- .gitignore
|   |-- eslint.config.js
|   |-- index.html
|   |-- package-lock.json
│   ├── package.json
|   |-- README.md
|   |-- tailwind.config.js
│   └── vite.config.js
|-- gitignore.js
├── README.md
└── package-lock.json / yarn.lock

```

## Setup & Installation

### Prerequisites

* Node.js >= 18
* MongoDB (local or cloud e.g., MongoDB Atlas)
* Git

### Clone the repository

```bash
git clone https://github.com/Coder-Stark/RootApp.git
cd pacp
```

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=<port>
MONGO_URI=<mongo_url>
JWT_SECRET=<secretKey>
ADMIN_PASSWORD=<admin_password>

CLOUD_NAME=<visit_cloudinary>
CLOUD_API_KEY=<visit_cloudinary>
CLOUD_API_SECRET=<visit_cloudinary>
```

Start backend:

```bash
nodemon server.js
```

The API will run on `http://localhost:8080`.

### Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Usage

### As a User

1. Sign up / Log in
2. Visit your Profile to see ID, contact, and flags (Has RD/FD/Loan)
3. Open Deposits Section to see RD/FD cards (auto-hides when empty)
4. Open Credits Section to see loans (array-based, auto-hides when empty)
5. Click Print Profile to print your profile card
6. Click View Sample PDF to preview how a combined RD/FD/Loan statement looks

**Static sample PDF path:** `frontend/public/sample-pdf.pdf`

### As an Admin

* Update user data for RD, FD, Loan
* Generate and share PDFs (optionally server-side)
* Maintain data integrity (users see a note: "Your data is updated by Admin only")

## Security & Compliance

* PACP is not a bank and does not imply a banking license
* Use HTTPS in production, rotate JWT secrets, and restrict CORS
* Perform KYC/AML checks only if required by your local regulations

## Future Enhancements

* Online payments (UPI/NetBanking) for deposits
* Email/SMS notifications for due EMIs and maturity
* Admin analytics dashboard (charts for deposits/loans)
* Multi-language support
* Mobile app (React Native)

## License

This project is licensed under the MIT License.

## Author

**Shivam Kumar**

LinkedIn: https://www.linkedin.com/in/shivam-kumar-fullstack-developer/

Open to collaboration and contributions!
