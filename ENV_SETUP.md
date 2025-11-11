# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory of your project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://myivofrtdhotajywvdzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXZvZnJ0ZGhvdGFqeXd2ZHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTUyNzQsImV4cCI6MjA3ODM5MTI3NH0.n4SFSD0yGHmQD4HmVDxWdzFwTS8ce3khTGwZ56ZbYQw
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## How to Get Your Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** > **API**
4. Scroll down to find the **service_role** key (it's different from the anon key)
5. Copy the service_role key and replace `your_service_role_key_here` in the `.env.local` file

**⚠️ Important Security Note:**
- The service_role key has admin privileges and should NEVER be exposed in client-side code
- Only use it in server-side code or API routes
- Never commit the `.env.local` file to version control (it's already in `.gitignore`)

## Verification

After setting up your `.env.local` file:

1. Restart your development server
2. The application should now be able to connect to your Supabase database
3. Make sure you've run the database migration script from `lib/supabase/database.sql` in your Supabase SQL editor

## Next Steps

1. Run the database migration: Execute `lib/supabase/database.sql` in Supabase SQL Editor
2. Create an admin user (see SETUP.md for details)
3. Add your logo to `public/logo.png`
4. Start the development server: `npm run dev`

