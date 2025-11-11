# Elite Properties Real Estate ERP - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Git (optional)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready (takes a few minutes)

2. **Run Database Migration**
   - In your Supabase dashboard, go to SQL Editor
   - Copy the contents of `lib/supabase/database.sql`
   - Paste and run the SQL script
   - This will create all necessary tables and set up Row Level Security (RLS)

3. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy the following:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - service_role key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Add Your Logo

1. Place your company logo in the `public` folder
2. Name it `logo.png`
3. Recommended size: 200x200px or larger (square format works best)
4. The logo will be used across the website and admin portal

### 5. Set Up Image Storage (Optional but Recommended)

1. **Create a Storage Bucket in Supabase**
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `property-images`
   - Set it to public
   - Create another bucket named `plot-images` (also public)

2. **Upload Images**
   - You can upload property and plot images to these buckets
   - Get the public URL for each image
   - Use these URLs when adding properties/plots in the admin panel

### 6. Create Admin User

1. **Sign Up a User**
   - Go to Authentication > Users in Supabase dashboard
   - Click "Add User" or use the sign-up flow
   - Create a user with email and password

2. **Set User as Admin**
   - Go to SQL Editor in Supabase
   - Run this SQL (replace with your user's email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

   - Or if the profile doesn't exist yet:

```sql
INSERT INTO profiles (id, email, name, role)
SELECT id, email, email, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com';
```

### 7. Run the Development Server

```bash
npm run dev
```

### 8. Access the Application

- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Post-Setup Configuration

### Add Company Information

1. Log in to the admin panel
2. Go to Website Content
3. Add company information (name, contact, address)
4. This will be displayed on receipts

### Add Initial Properties

1. Log in to the admin panel
2. Go to Properties > Add Property
3. Fill in property details
4. Add image URLs (from Supabase Storage or external URLs)
5. Add virtual tour URL if available

### Add Plots

1. Log in to the admin panel
2. Go to Plots > Add Plot
3. Fill in plot details
4. Set status (available, sold, reserved)

## Troubleshooting

### Issue: Cannot connect to Supabase

**Solution**: Check that your environment variables are correct and the Supabase project is active.

### Issue: "Access denied" when logging in as admin

**Solution**: Make sure you've set the user's role to 'admin' in the profiles table.

### Issue: Images not loading

**Solution**: 
- Check that image URLs are correct
- If using Supabase Storage, ensure buckets are set to public
- Check browser console for CORS errors

### Issue: Receipt PDF not generating

**Solution**: 
- Check that jsPDF and html2canvas are installed
- Check browser console for errors
- Try a different browser

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add all three environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Update Supabase RLS Policies

In production, you may want to review and tighten RLS policies for security.

## Support

For issues or questions, refer to the main README.md or contact the development team.

