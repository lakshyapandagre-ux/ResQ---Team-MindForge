# ResQ 🚨

A modern, civic engagement and emergency response platform built with React, TypeScript, and Vite. ResQ empowers citizens to report issues, volunteer in community squads, and access emergency services rapidly.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **State/Routing:** React Query, React Router v7
- **Backend as a Service:** Supabase (PostgreSQL, Auth, Realtime)
- **AI Integration:** Google Gemini (civic chatbot assistant)
- **Architecture:** PWA-ready, Offline-first capabilities

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or pnpm
- A Supabase Project
- Google Gemini API Key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd resq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *Note: Your `.env` file should NEVER be committed to version control.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/`: Reusable UI components and layouts.
- `src/pages/`: Main application routes (Dashboard, Services, Emergency).
- `src/contexts/`: Global React contexts (AuthContext).
- `src/services/`: External API integrations (Gemini, Supabase DB queries).
- `src/lib/`: Utility functions and library initializations.
- `supabase/migrations/`: Database schema and SQL functions.

## 🛡️ Security

This repository utilizes strict `.gitignore` policies to prevent secret leakage. Never commit your Supabase Anon Key or Gemini API Key. If a key is accidentally exposed, revoke it immediately in the respective provider dashboard.

## 📜 License
MIT License
