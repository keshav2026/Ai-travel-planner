import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Hero from "@/components/custom/Hero"
import CreateTrip from "./create-trip"
import Header from "./components/custom/Header"
import { Toaster } from 'sonner'
import ViewTrip from "./view-trip/[tripId]"
import MyTrips from "./my-trips"
import { auth } from "@/service/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })
  }, [])

 return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header user={user} setUser={setUser} />
      <Toaster richColors />
      <main className="flex-1 flex flex-col overflow-auto">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/create-trip" element={<CreateTrip user={user} setUser={setUser} />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          <Route path="/my-trips" element={<MyTrips user={user} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App