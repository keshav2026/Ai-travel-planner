import React, { useState, useRef } from 'react'
import { SelectTravellersList, SelectBudgetOptions, AI_PROMPT } from '@/constants/options'
import { generateTrip } from '@/service/AIModel'
import { toast } from 'sonner'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider, db } from '@/service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

function CreateTrip({ user, setUser }) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleSelection = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const searchPlaces = (value) => {
    setQuery(value)
    setShowDropdown(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 3) return setSuggestions([])

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&limit=5&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
        )
        const data = await res.json()
        setSuggestions(data.features || [])
      } catch (err) {
        console.error('Geoapify error:', err)
        setSuggestions([])
      }
    }, 400)
  }

  const handleSelectPlace = (place) => {
    const name = place.properties.formatted
    setQuery(name)
    handleSelection('location', name)
    setSuggestions([])
    setShowDropdown(false)
  }

  const onGenerateTrip = async () => {
    if (!user) {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        setUser(result.user)
        return
      } catch (error) {
        toast.error('Sign in failed. Please try again.')
        return
      }
    }

    if (!formData.location || !formData.noOfDays || !formData.traveller || !formData.budget) {
      toast.error('Please fill all the fields!')
      return
    }

    if (formData.noOfDays > 10) {
      toast.error('Please enter trip days less than or equal to 10!')
      return
    }

    setLoading(true)

    const prompt = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{noOfDays}', formData.noOfDays)
      .replace('{traveller}', formData.traveller)
      .replace('{budget}', formData.budget)

    try {
      const tripText = await generateTrip(prompt)

      let tripData
      try {
        tripData = JSON.parse(tripText)
      } catch (e) {
        const match = tripText.match(/\{[\s\S]*\}/)
        if (match) {
          tripData = JSON.parse(match[0])
        } else {
          throw new Error('Could not parse AI response')
        }
      }

      const docId = Date.now().toString()
      await setDoc(doc(db, 'AITrips', docId), {
        userSelection: formData,
        tripData: tripData,
        userEmail: user.email,
        id: docId
      })

      toast.success('Trip generated!')
      navigate(`/view-trip/${docId}`)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen relative'>

      {/* Full page background image */}
      <div
        className='fixed inset-0 bg-cover bg-center z-0'
        style={{ backgroundImage: `url('/images/travel-gear.jpg')` }}
      />
      <div className='fixed inset-0 bg-black/70 z-0' />

      {/* Hero Banner */}
      <div className='relative z-10 pt-24 px-10 md:px-32 lg:px-56 pb-6 border-b border-white/10'>
        <p className='text-white/60 text-xs uppercase tracking-widest mb-2'>✈️ AI Powered</p>
        <h1 className='text-white font-bold text-4xl'>Plan Your Perfect Trip</h1>
        <p className='text-white/60 mt-1'>Tell us your preferences and we'll create a custom itinerary</p>
      </div>

      {/* Form Content */}
      <div className='relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 py-12'>

        {/* Destination */}
        <div className='mb-10'>
          <h2 className='text-xl font-semibold mb-4 text-white'>
            🌍 What is your destination of choice?
          </h2>
          <div className='relative'>
            <input
              type='text'
              value={query}
              placeholder='Search for a place...'
              className='border p-4 rounded-2xl w-full text-base outline-none transition-all bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/30 focus:border-white/50 focus:bg-white/15'
              onChange={(e) => searchPlaces(e.target.value)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && suggestions.length > 0 && (
              <div className='absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-50 border border-white/20 backdrop-blur-md bg-black/60'>
                {suggestions.map((place, i) => (
                  <div
                    key={i}
                    className='px-4 py-3 text-white text-sm cursor-pointer hover:bg-white/10 transition-all border-b border-white/10 last:border-none'
                    onMouseDown={() => handleSelectPlace(place)}
                  >
                    <span className='mr-2 opacity-60'>📍</span>
                    {place.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Number of Days */}
        <div className='mb-10'>
          <h2 className='text-xl font-semibold mb-4 text-white'>
            📅 How many days?
          </h2>
          <input
            type='number'
            placeholder='Ex. 3'
            min={1}
            max={10}
            className='border p-4 rounded-2xl w-full text-base outline-none transition-all bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/30 focus:border-white/50 focus:bg-white/15'
            onChange={(e) => handleSelection('noOfDays', e.target.value)}
          />
        </div>

        {/* Travellers */}
        <div className='mb-10'>
          <h2 className='text-xl font-semibold mb-4 text-white'>
            👥 Who are you travelling with?
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {SelectTravellersList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelection('traveller', item.title)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105
                  ${formData.traveller === item.title ? 'ring-2 ring-white scale-105' : ''}`}
              >
                <img
                  src={
                    item.title === 'Just Me' ? '/images/solo.jpg' :
                    item.title === 'Couple' ? '/images/couples.jpg' :
                    item.title === 'Family' ? '/images/family.jpg' :
                    '/images/friends (1).jpg'
                  }
                  className='w-full h-32 object-cover'
                  alt={item.title}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3'>
                  <div className='text-2xl mb-1'>{item.icon}</div>
                  <h3 className='text-white font-bold text-sm'>{item.title}</h3>
                  <p className='text-white/60 text-xs'>{item.desc}</p>
                </div>
                {formData.traveller === item.title && (
                  <div className='absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center'>
                    <span className='text-black text-xs'>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className='mb-12'>
          <h2 className='text-xl font-semibold mb-4 text-white'>
            💰 What is your budget?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelection('budget', item.title)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105
                  ${formData.budget === item.title ? 'ring-2 ring-white scale-105' : ''}`}
              >
                <img
                  src={
                    item.title === 'Cheap' ? '/images/sailing.jpg' :
                    item.title === 'Moderate' ? '/images/friends (2).jpg' :
                    '/images/luxury.jpg'
                  }
                  className='w-full h-40 object-cover'
                  alt={item.title}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4'>
                  <div className='text-3xl mb-1'>{item.icon}</div>
                  <h3 className='text-white font-bold text-lg'>{item.title}</h3>
                  <p className='text-white/60 text-sm'>{item.desc}</p>
                  <p className='text-white/40 text-xs mt-1'>{item.price}</p>
                </div>
                {formData.budget === item.title && (
                  <div className='absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                    <span className='text-black text-xs font-bold'>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className='flex justify-end pb-10'>
          <button
            className='bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-all disabled:opacity-40 hover:scale-105'
            onClick={onGenerateTrip}
            disabled={loading}
          >
            {loading ? '✈️ Generating...' : '✈️ Generate My Trip'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateTrip