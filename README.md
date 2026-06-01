# ✈️ PlanAway — Your Personal Travel Planner

> Discover, plan and experience the world — one trip at a time.

PlanAway is a full-stack travel planning web app that generates personalized itineraries based on your destination, budget, travel style and number of days. Built with React, Firebase and Groq.

---

## 🌍 Live Demo

🔗 [ai-travel-planner-keshavs-projects-c3ceaede.vercel.app](https://ai-travel-planner-keshavs-projects-c3ceaede.vercel.app)

---

## 📸 Screenshots

> Hero Page — Dynamic destination slideshow with immersive full-screen backgrounds

> Create Trip — Select your destination, days, travel group and budget

> View Trip — Hotel recommendations and day-by-day itinerary

> My Trips — All your saved adventures in one place

---

## 🚀 Features

- **Dynamic Hero Slideshow** — Full-screen destination photos that rotate every 5 seconds with descriptions
- **Trip Generator** — Fill in your preferences and get a complete itinerary with hotels and daily plans
- **Google Authentication** — Sign in with your Google account, session persists across page refreshes
- **Firestore Database** — All generated trips are saved and accessible anytime
- **My Trips Dashboard** — View, search and sort all your saved trips
- **Interactive Cards** — Hotel and place cards link directly to Google Maps
- **Dark / Light Mode** — Toggle between a dark luxury theme and a light vibrant theme
- **Fully Responsive** — Works on desktop, tablet and mobile
- **Loading Skeletons** — Smooth loading states throughout the app

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Firebase Auth | Google authentication |
| Cloud Firestore | Database |
| Groq (Llama 3.3) | Trip generation |
| Unsplash API | Dynamic trip card images |
| Vercel | Deployment |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── custom/
│   │   ├── Header.jsx        # Navbar with auth and theme toggle
│   │   ├── Hero.jsx          # Landing page with destination slideshow
│   │   └── Loading.jsx       # Skeleton loader
│   └── ui/
│       ├── button.jsx
│       └── input.jsx
├── constants/
│   └── options.jsx           # Traveller types, budget options, AI prompt
├── context/
│   └── ThemeContext.jsx      # Dark/light mode state
├── create-trip/
│   └── index.jsx             # Trip creation form
├── my-trips/
│   └── index.jsx             # Saved trips dashboard
├── view-trip/
│   └── [tripId]/
│       └── index.jsx         # Trip results page
├── service/
│   ├── AIModel.jsx           # Groq integration
│   └── firebaseConfig.jsx    # Firebase setup
├── App.jsx
└── main.jsx
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Firebase project
- A Groq API key
- An Unsplash developer account

### 1. Clone the repository

```bash
git clone https://github.com/keshav2026/ai-travel-planner.git
cd ai-travel-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
```

### 4. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Google Sign-In
4. Create a **Firestore Database** in test mode
5. Copy your Firebase config into `.env.local`

### 5. Set up Groq

1. Go to [console.groq.com](https://console.groq.com)
2. Create an account and generate an API key
3. Add it to `.env.local` as `VITE_GROQ_API_KEY`

### 6. Set up Unsplash

1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Register as a developer and create an app
3. Copy the Access Key to `.env.local`

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment

This project is deployed on Vercel.

### Steps to deploy your own:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from `.env.local` in Vercel's project settings
4. Click **Deploy**
5. Add your Vercel domain to Firebase → Authentication → Authorized Domains

---

## 🔑 API Keys Required

| Service | Where to get it | Required |
|---|---|---|
| Firebase | [console.firebase.google.com](https://console.firebase.google.com) | ✅ Yes |
| Groq | [console.groq.com](https://console.groq.com) | ✅ Yes |
| Unsplash | [unsplash.com/developers](https://unsplash.com/developers) | ✅ Yes |
| Google Places | [console.cloud.google.com](https://console.cloud.google.com) | ⚡ Optional |

---

## 🗺️ Roadmap

- [ ] Google Places autocomplete for destination search
- [ ] Share trip with friends via link
- [ ] Delete trips from My Trips page
- [ ] Export itinerary as PDF
- [ ] Weather forecast for destination
- [ ] Flight search integration
- [ ] Multiple language support

---

## 🙏 Acknowledgements

- [Unsplash](https://unsplash.com) for beautiful destination photography
- [Groq](https://groq.com) for fast and free LLM inference
- [Firebase](https://firebase.google.com) for authentication and database
- [Vercel](https://vercel.com) for seamless deployment

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/keshav2026">Keshav</a></p>
