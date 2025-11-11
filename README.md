# Elite Properties Real Estate ERP

A comprehensive Real Estate ERP system built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Features

### Public Website
- **Property Listings**: Browse available properties with images, details, and virtual tour links
- **Plots Section**: View available, reserved, and sold plots
- **Schedule Site Visit**: Clients can request site visits for properties or plots
- **Virtual Tour Integration**: Configurable virtual tour links for each property
- **Responsive Design**: Modern, mobile-friendly interface

### Admin ERP Dashboard
- **Properties Management**: Create, edit, and manage property listings
- **Plots Management**: Manage plot inventory and status
- **Site Visits Management**: View and update site visit requests
- **Receipts Management**: Create, view, download, and print receipts
- **Clients Management**: View client information and activity
- **Website Content Management**: Manage banners, announcements, and company information
- **User Settings**: Update profile, email, and password

### Key Features
- **Centralized Logo Management**: Logo stored in `/public/logo.png` and used across the platform
- **PDF Receipt Generation**: Download and print receipts using jsPDF and html2canvas
- **Real-time Updates**: All changes in admin panel reflect immediately on public website
- **Supabase Integration**: Secure authentication and database management
- **Role-based Access**: Admin-only access to ERP dashboard

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Real estate"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL script from `lib/supabase/database.sql` in your Supabase SQL editor
   - Get your Supabase URL and anon key from Project Settings > API

4. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

5. **Add logo**
   - Place your company logo as `public/logo.png`
   - The logo will be used across the website and admin portal
   - See `public/README.md` for logo specifications and details

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Public website: `http://localhost:3000`
   - Admin login: `http://localhost:3000/admin/login`

## Database Schema

The application uses the following main tables:
- `properties`: Property listings with details, images, and virtual tour links
- `plots`: Plot inventory with status and details
- `site_visits`: Site visit requests from clients
- `receipts`: Payment receipts for properties and plots
- `profiles`: User profiles linked to Supabase auth
- `website_content`: Website banners, announcements, and company info

## Admin Access

1. Create a user account through Supabase Auth
2. Update the user's role to 'admin' in the `profiles` table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Log in at `/admin/login`

## Virtual Tour Integration

Virtual tour URLs can be configured per property from the admin panel. The system supports:
- External virtual tour platforms (e.g., Matterport, Kuula)
- Custom 360° tour URLs
- Embedded iframe support

## Receipt Generation

Receipts can be:
- Viewed in a modal
- Downloaded as PDF using jsPDF
- Printed directly from the browser

Company information (name, contact, address) is displayed on receipts and can be configured in the website content section.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── admin/             # Admin ERP dashboard
│   ├── properties/        # Property pages
│   ├── plots/             # Plots page
│   └── schedule-visit/    # Site visit form
├── components/            # React components
│   ├── Navbar.tsx        # Main navigation
│   ├── PropertyCard.tsx  # Property listing card
│   ├── PlotCard.tsx      # Plot listing card
│   └── ReceiptModal.tsx  # Receipt display and PDF generation
├── lib/                   # Utilities
│   └── supabase/         # Supabase client and types
└── public/               # Static assets
    └── logo.png          # Company logo
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Supabase**: Backend as a service (Auth, Database, Storage)
- **jsPDF**: PDF generation
- **html2canvas**: HTML to canvas conversion for PDFs
- **Lucide React**: Icon library

## License

This project is proprietary software for Elite Properties.

## Support

For issues and questions, please contact the development team.

