# FinModel AI — 3 Statement Financial Model Platform

A modern, AI-powered platform for generating and analyzing 3-statement financial models, built with Next.js, TypeScript, and Shadcn/UI.

## ✨ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Features

- **Dashboard**: At-a-glance overview with KPIs and charts.
- **Data Input**: Intuitive form and table for all financial entries.
- **Income Statement**: Real-time calculation of Profit & Loss.
- **Balance Sheet**: Always-balanced view of Assets, Liabilities, and Equity.
- **Cash Flow Statement**: Indirect method calculation of cash movements.
- **Assumptions Manager**: Control model drivers like growth rates and margins.
- **Scenario Analysis**: Compare Base, Bull, and Bear cases side-by-side.
- **AI Financial Analyst**: Get an executive summary and recommendations from Google Gemini.
- **Global Tax Reference**: A handy guide to tax rates in major economies.

## 🏁 Getting Started

Follow these steps to get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/financial-model.git
    cd financial-model
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize Shadcn/UI (if needed):**
    ```bash
    npx shadcn-ui@latest init
    ```

4.  **Set up environment variables:**
    - Copy the example file: `cp .env.local.example .env.local`
    - Open `.env.local` and add your Google Gemini API key.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ☁️ Deployment to Vercel

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and sign up or log in.
3.  Click "Add New... > Project" and import your GitHub repository.
4.  In the project settings, go to "Environment Variables" and add your `GEMINI_API_KEY`.
5.  Click "Deploy". Vercel will automatically build and deploy your Next.js application.

## 📂 Project Structure