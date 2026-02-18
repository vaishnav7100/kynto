# Kynto: Instant AI Roadmaps 🚀

**Turn your goals into actionable, phased roadmaps in seconds.**

Kynto is a cutting-edge AI application that generates structured productivity roadmaps using **Groq (Llama 3)**, styled with a premium **Glassmorphism** UI, and powered by **Next.js 15** & **Supabase**.

![Kynto Project](https://img.shields.io/badge/Status-Live-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-blue)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-orange)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green)

---

## ✨ Features

- **⚡ Instant AI Generation**: Powered by Groq's Llama 3 for lightning-fast roadmap creation.
- **🎨 Glassmorphism UI**: Beautiful, modern dark-mode interface with ambient glows and glass cards.
- **🔐 First-Time Free**: Smart `localStorage` logic allows guests to try once without signing up.
- **👤 Supabase Auth**: Secure sign-up/login to save unlimited roadmaps.
- **💾 Cloud Sync**: All your roadmaps are saved to Supabase PostgreSQL and synced across devices.
- **📱 Responsive Design**: Fully responsive sidebar, mobile drawer, and adaptive layouts.
- **📋 Markdown Rendering**: Rich text output with clean formatting and copy-to-clipboard functionality.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion (Animations)
- **AI Provider**: [Groq Cloud](https://groq.com/) (Llama 3.3 70B Versatile)
- **Backend/DB**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vaishnav7100/kynto.git
cd kynto
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI (Free API Key)
GROQ_API_KEY=gsk_your_groq_api_key
```

> **Note:** Get your free Groq API key at [console.groq.com](https://console.groq.com/keys).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🗄️ Database Schema

Run this SQL in your Supabase SQL Editor to set up the database:

```sql
create table plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table plans enable row level security;

-- Policy: Users can only see/edit their own plans
create policy "Users can manage their own plans"
  on plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 📦 Deployment

Deploy easily on **Vercel**:

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the **Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`).
4. Click **Deploy**.

---

## 📄 License

This project is open-source and available under the MIT License.

Built with ❤️ by [Vaishnav](https://github.com/vaishnav7100)
