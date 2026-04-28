# Expense Tracker

A modern, full-stack Expense Tracker built with a stuning design system, full Light/Dark mode support, and Firebase backend integration. Easily track your income and expenses with premium layouts, glow-effects, and intelligent charts.

## ✨ Features
- **Modern Glassmorphism UI:** Complete overhaul with beautiful `.glass-card` styling, radiant gradients, and text-glow accents.
- **Secure Authentication:** Built-in email/password login integrated seamlessly with Firebase Authentication.
- **User Dashboard:** Dedicated personalized user profile page with auto-generating colorful initials-based avatars.
- **Smart Data Tracking:** Add transactions via categorical input, edit records dynamically, and calculate your total monthly budget.
- **Data Visualization:** Interactive analytics powered by `recharts` to seamlessly visualize expense distribution.
- **Full Theme Support:** Fully responsive light and dark themes using Tailwind CSS system-level configurations.

## 🚀 Tech Stack
- **Frontend Framework:** React via `@tanstack/react-router` and Vite
- **Styling:** Tailwind CSS (v4) + Shadcn UI components
- **Backend & Database:** Google Firebase (Auth & Firestore)
- **Icons & Tooling:** Lucide React, TypeScript 

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd expenzestracker
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:8081` to view the app!

## 🔧 Firebase Configuration
Ensure that your Firebase API keys and Firestore rules are properly set up inside your `.env` variables or securely bound when deploying! This app specifically heavily utilizes Firebase `Auth` and `Firestore Database` for transaction states. Ensure you manually create your required database indexes via the Firebase Dashboard for filtering compound queries!

---
*Developed with a passion for beautiful, functional design interfaces.*
