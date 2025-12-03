# 🚀 Getting API Keys Setup

## The most common reason for errors is missing or invalid API keys. Follow these steps carefully.

### Step 1: Get Your Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** (or existing project if you have one)
4. Your API key will be generated - **Copy it** (the long string of characters)
5. Paste it into your `.env.local` file:

```bash
VITE_GEMINI_API_KEY=your_actual_key_here_not_this_text
```

### Step 2: Get Your Supabase Credentials

1. Go to: **https://supabase.com**
2. Login to your project or create one
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → paste into `VITE_SUPABASE_URL`
   - **Anon Key** → paste into `VITE_SUPABASE_ANON_KEY`

### Your `.env.local` Should Look Like:

```bash
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSyD...
```

### Step 3: Important - Model Used

This application uses **`gemini-1.5-flash`** which is:
- ✅ **Fast** - Quick responses
- ✅ **Cost-effective** - Lower API costs
- ✅ **Available** - Currently supported by Google
- ✅ **Good for chat** - Perfect for conversational AI

(Previously used `gemini-pro` which is now deprecated)

### Step 4: Troubleshooting

**If you see: "Gemini API key not configured"**
- Check `.env.local` file exists in project root
- Make sure `VITE_GEMINI_API_KEY` has an actual key, not placeholder text
- Restart dev server: `npm run dev`
- Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

**If you see: "API key is invalid or does not have permission"**
- Check the API key is correct (copy-paste again from makersuite.google.com)
- Ensure Generative Language API is enabled in Google Cloud Console
- Try generating a new API key

**If you see: "models/gemini-pro is not found"**
- This means you're using an old version of the code
- Update the code (it should now use `gemini-1.5-flash`)
- Clear browser cache and restart dev server

**If messages still show error**
- Open browser Developer Tools: `F12`
- Go to **Console** tab
- Try sending a message and look for detailed error message
- Screenshot the error and check what it says
- Common issues:
  - Wrong API key format
  - Missing environment variables
  - Network connectivity issues
  - API rate limit exceeded

### Step 5: After Setting Up

1. **Save `.env.local`** with your actual credentials
2. **Restart dev server**: Stop it and run `npm run dev` again
3. **Hard refresh browser**: `Ctrl+Shift+R`
4. **Clear browser cache** if still having issues
5. **Try sending a message**

If you see a specific error message in the chatbot, that's good! It means the configuration is working but there's an API issue. Share that error message for better debugging.

### Common Errors and Fixes

| Error | Fix |
|-------|-----|
| "API key not configured" | Add `VITE_GEMINI_API_KEY` to `.env.local` |
| "API key is invalid" | Copy-paste correct key from makersuite.google.com |
| "First content should be with role" | Refresh page and try again |
| "Failed to fetch" | Check internet connection or CORS settings |
| "Network error" | Restart dev server and browser |
| "models/gemini-pro is not found" | Update code - now uses gemini-1.5-flash |

