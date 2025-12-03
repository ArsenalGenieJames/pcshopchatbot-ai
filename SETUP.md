# PC Shop Chatbot - Setup Instructions

## Database Setup

To create the users table in Supabase, follow these steps:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to the **SQL Editor** section
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
create table public.users (
  id uuid not null default gen_random_uuid (),
  name text null,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;
```

6. Click **Run** to execute the query

## Environment Setup

Make sure your `.env` file contains your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Running the Application

```bash
npm run dev
```

The landing page will ask for the customer's name, save it to the database, and then proceed to the chatbot interface.
