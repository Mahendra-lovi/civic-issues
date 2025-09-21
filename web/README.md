# Civic Issues Dashboard

A Next.js web application for managing and analyzing civic issues in your community.

## Features

- **Authentication**: Simple sign-in system with persistent login state
- **Dashboard Layout**: Clean, responsive layout with navigation menu
- **Analysis Page**: View and manage civic issues with filtering and categorization
- **Reports Page**: Generate and view reports on civic issues
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign In**: Use any email and password to sign in (demo mode)
2. **Analysis**: After signing in, you'll be redirected to the Analysis page where you can:
   - View all civic issues
   - Filter by category (Infrastructure, Public Safety, Environment, Transportation)
   - See issue details, priority levels, and status
   - View summary statistics
3. **Reports**: Navigate to the Reports page to:
   - View generated reports
   - See report status and details
   - Access summary statistics

## Project Structure

```
web/
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── components/
│   │   └── ProtectedRoute.tsx   # Route protection component
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout with navigation
│   │   ├── analysis.tsx         # Analysis page
│   │   └── reports.tsx          # Reports page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Sign-in page
├── public/                      # Static assets
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management
- **Next.js App Router** - File-based routing

## Demo Data

The application includes mock data for demonstration purposes:
- Sample civic issues with different priorities and statuses
- Pre-generated reports with various states
- Realistic categories and descriptions

## Authentication

Currently uses a simple demo authentication system. In a production environment, you would integrate with a proper authentication service like Auth0, Firebase Auth, or Supabase.