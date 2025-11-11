# Quick Start Guide

## Your Supabase Credentials

Your Supabase project is already configured:
- **URL**: https://myivofrtdhotajywvdzo.supabase.co
- **Anon Key**: Already configured in the codebase

## Immediate Next Steps

### 1. Create `.env.local` file

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://myivofrtdhotajywvdzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXZvZnJ0ZGhvdGFqeXd2ZHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTUyNzQsImV4cCI6MjA3ODM5MTI3NH0.n4SFSD0yGHmQD4HmVDxWdzFwTS8ce3khTGwZ56ZbYQw
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To get your Service Role Key:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **service_role** key (not the anon key)
5. Replace `your_service_role_key_here` in `.env.local`

### 2. Run Database Migration

1. Go to your Supabase dashboard
2. Click on **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `lib/supabase/database.sql`
5. Click **Run** to execute the migration
6. Verify all tables are created successfully

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add User** (or use the sign-up flow)
3. Create a user with email and password
4. Go to **SQL Editor** and run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

### 5. Add Your Logo

1. Place your company logo in the `public` folder
2. Name it `logo.png`
3. Recommended size: 200x200px or larger

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access the Application

- **Public Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

## Troubleshooting

### Issue: Cannot connect to Supabase
- Verify your `.env.local` file exists and has correct credentials
- Restart your development server after creating `.env.local`
- Check that your Supabase project is active

### Issue: Tables don't exist
- Make sure you ran the database migration script
- Check the Supabase SQL Editor for any errors
- Verify all tables were created in the Table Editor

### Issue: Can't login as admin
- Verify you set the user role to 'admin' in the profiles table
- Check that the user exists in the auth.users table
- Make sure the profile was created (it should be automatic via trigger)

## Need Help?

Refer to:
- `SETUP.md` - Detailed setup instructions
- `README.md` - Main documentation
- `FEATURES.md` - Features list

