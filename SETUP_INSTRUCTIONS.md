# PC Shop Chatbot - Setup Guide

This chatbot application helps users find the perfect PC components and parts. It integrates Gemini AI for intelligent recommendations and Supabase for data storage.

## Features

- ✅ User registration with landing page
- ✅ AI-powered chatbot using Google Gemini
- ✅ PC component recommendation system
- ✅ Conversation history tracking
- ✅ Real-time chat interface
- ✅ Session persistence with localStorage

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key

## Database Setup (Supabase)

First, create the required tables in your Supabase project. Run the following SQL:

```sql
-- Users table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Conversations table
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Messages table
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid,
  sender text,
  message text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id)
);

-- PC Parts table
CREATE TABLE public.pc_parts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text,
  name text,
  specs text,
  price numeric,
  CONSTRAINT pc_parts_pkey PRIMARY KEY (id)
);

-- Recommendations table
CREATE TABLE public.recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid,
  part_id uuid,
  reason text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT recommendations_pkey PRIMARY KEY (id),
  CONSTRAINT recommendations_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT recommendations_part_id_fkey FOREIGN KEY (part_id) REFERENCES public.pc_parts(id)
);
```

### Add Sample PC Parts (Optional)

```sql
INSERT INTO public.pc_parts (type, name, specs, price) VALUES
('CPU', 'AMD Ryzen 5 5600X', '6-core, 12-thread, 3.7GHz base, 4.6GHz boost', 199.99),
('CPU', 'Intel Core i9-13900K', '24-core, 32-thread, 5.8GHz max', 589.99),
('GPU', 'NVIDIA RTX 4070', '5888 CUDA cores, 12GB GDDR6', 599.99),
('GPU', 'AMD RX 7800 XT', '60 compute units, 16GB GDDR6', 449.99),
('RAM', 'Corsair Vengeance DDR5 32GB', '32GB, 5600MHz, CAS 36', 129.99),
('RAM', 'G.Skill Trident Z5 RGB 16GB', '16GB, 6000MHz, CAS 30', 79.99),
('SSD', 'Samsung 990 Pro 1TB', 'NVMe M.2, PCIe 4.0, 7100MB/s read', 99.99),
('SSD', 'WD Black SN850X 2TB', 'NVMe M.2, PCIe 4.0, 7100MB/s read', 179.99),
('PSU', 'Corsair RM850e', '850W, 80+ Gold, Modular', 134.99),
('PSU', 'EVGA SuperNOVA 1000 G6', '1000W, 80+ Gold, Fully Modular', 179.99),
('Cooler', 'Noctua NH-D15', 'Air cooler, dual tower, LGA1700', 99.99),
('Cooler', 'NZXT Kraken X73', 'AIO Liquid, 360mm radiator', 179.99);
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pcshopchatbot-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local` file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Get your API keys:**

   - **Supabase**: 
     1. Go to [https://supabase.com](https://supabase.com)
     2. Create a new project or use an existing one
     3. Go to Settings → API
     4. Copy your project URL and anon key

   - **Gemini API Key**:
     1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
     2. Click "Create API Key" (you may need to enable Generative Language API first)
     3. Copy your API key

5. **Update `.env.local`**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## Running the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx      # User registration page
│   └── ChatbotPage.jsx      # Main chatbot interface
├── services/
│   └── geminiService.js     # Gemini AI integration
├── App.jsx                  # Main app component
├── main.jsx                 # React entry point
├── index.css                # Tailwind CSS setup
└── supabaseClient.js        # Supabase configuration
```

## How It Works

1. **Landing Page**: User enters their name and creates an account in Supabase
2. **Chat Interface**: User is taken to the chatbot page where they can chat
3. **AI Processing**: Messages are sent to Google Gemini API with context about PC parts
4. **Recommendations**: The AI suggests appropriate PC components based on user needs
5. **History Tracking**: All conversations and messages are stored in Supabase

## Technologies Used

- **Frontend**: React + Vite + Tailwind CSS
- **AI**: Google Gemini Pro
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks

## Troubleshooting

### Blank page?
- Check that your `.env.local` is properly configured
- Ensure the development server is running with `npm run dev`

### "Failed to generate response" error?
- Verify your Gemini API key is correct
- Check that you have enabled the Generative Language API

### Database errors?
- Make sure all tables are created in Supabase
- Verify your Supabase URL and anon key

## Future Enhancements

- [ ] User authentication (signup/login)
- [ ] Saved recommendations history
- [ ] PC build templates
- [ ] Price tracking
- [ ] Specification calculator
- [ ] Admin panel for managing PC parts

## License

MIT License - feel free to use this project for your own purposes.
