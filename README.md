<div align="center">
  <img width="1200" height="475" alt="Mind-matrix Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
  <h1>Mind Matrix (Socratic AI)</h1>
  <p>A next-generation AI Cognitive Mentor built to guide, challenge, and elevate student understanding through Socratic dialogue and dynamic mastery tracking.</p>
</div>

---

## 🌟 Overview

Mind Matrix (Socratic AI) is a highly interactive, beautifully designed educational platform that acts as a personal cognitive mentor. Instead of simply providing answers, it uses advanced AI (Google Gemini) to engage users in Socratic dialogue, map out their conceptual understanding across domains (like Physics, Chemistry, and Mathematics), and proactively identify and resolve "cognitive friction."

## ✨ Features

- **🧠 Cognitive Landscape (Mastery Map)**: Explore a dynamic, interactive graph of interconnected concepts. Instantly visualize your mastery level, pending topics, and areas of high friction.
- **💬 Socratic Chat**: Engage in deep, pedagogical dialogue with the AI mentor. The system challenges misconceptions and guides you to the correct conclusions using Socratic questioning.
- **📈 Dashboard Trajectories**: Track your learning velocity and mastery trajectory over time through responsive, data-rich visualizations.
- **📓 Reflections Journal**: Log your thoughts and breakthroughs, and receive synthesized mentor feedback to solidify your conceptual frameworks.
- **🎨 Vibrant, Adaptive UI**: Features a meticulously designed, highly energetic visual identity. Fully supports both Light (Vivid Indigo/Magenta) and Dark (Neon Cyberpunk) modes with strict WCAG AA contrast compliance.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository** (if applicable) and navigate to the project directory:
   ```bash
   cd Mind-matrix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view the application in your browser.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Build Tool**: Vite
- **AI Integration**: `@google/genai` (Google Gemini)
- **Animations**: Motion (Framer Motion)
- **Backend/Routing**: Express (via `server.ts` for localized API routing/SSR if applicable)

## 🎨 Design System

Mind Matrix utilizes a heavily customized CSS variable architecture (`src/index.css`) injected via Tailwind `@theme`. 
- **Light Mode**: High-vibrancy Electric Indigo (`#4F00FF`) and Vivid Magenta (`#C2005F`) mapped onto cool-tinted bright surfaces.
- **Dark Mode**: High-contrast Neon variants mapped onto deep, glowing navy-black canvases (`#0A0A12`).

## 📜 License

This project is licensed under the MIT License.
