# EventHub - Event Registration Platform

A modern, responsive event registration platform built with React, TypeScript, and Supabase.

## Features

- **Event Management**: Create, edit, and manage events with detailed information
- **User Registration**: Simple and intuitive event registration process
- **Admin Dashboard**: Comprehensive dashboard for event organizers
- **Real-time Updates**: Live updates for registrations and event status
- **Responsive Design**: Mobile-first design that works on all devices
- **Secure Authentication**: Admin login with Supabase authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database + Authentication)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd registration-pulse-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8082`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── integrations/       # External service integrations
├── data/              # Data models and utilities
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Database Schema

The project uses two main tables:

- **events**: Stores event information (title, description, date, location, etc.)
- **registrations**: Stores user registrations for events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
