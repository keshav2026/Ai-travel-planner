import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/service/firebaseConfig'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

const fallbackImages = [
  '/images/paris.jpg',
  '/images/venice.jpg',
  '/images/cinque-terre.jpg',
  '/images/maldives.jpg',
  '/images/sailing.jpg',
  '/images/beach-sunset.jpg',
  '/images/infinity-pool.jpg',
  '/images/aerial-beach.jpg',
]

const toArray = (val) =>
  Array.isArray(val) ? val : Object.values(val || {})

function ViewTrip() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState(null)
  const [placeImages, setPlaceImages] = useState({})

  useEffect(() => {
    if (tripId) getTripData()
  }, [tripId])

  const fetchUnsplashImage = async (query, fallback) => {
    if (!UNSPLASH_KEY) return fallback
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape`
      )
      const data = await res.json()
      return data.results?.[0]?.urls?.regular || fallback
    } catch {
      return fallback
    }
  }

  const getTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setTrip(data)

        const location = data.userSelection?.location || 'travel destination'
        const hero = await fetchUnsplashImage(location, fallbackImages[0])
        setHeroImage(hero)

        const imageMap = {}
        const itinerary = toArray(data.tripData?.itinerary)
        const hotels = toArray(data.tripData?.hotels)

        for (const day of itinerary) {
          for (const place of toArray(day.places)) {
            const img = await fetchUnsplashImage(
              `${place.placeName} ${location}`,
              fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
            )
            imageMap[place.placeName] = img
          }
        }

        for (const hotel of hotels) {
          const img = await fetchUnsplashImage(
            `${hotel.hotelName} ${location} hotel`,
            fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
          )
          imageMap[hotel.hotelName] = img
        }

        setPlaceImages(imageMap)
      } else {
        console.error('Trip not found')
      }
    } catch (err) {
      console.error('Failed to load trip:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') return 'N/A'
    if (price === 0 || price === '0' || String(price).toLowerCase() === 'free') return 'Free'
    const num = Number(price)
    if (isNaN(num)) return price
    return `₹${num.toLocaleString('en-IN')}`
  }

  if (loading) return (
    <div className='flex items-center justify-center min-h-screen bg-[#0a0f1e]'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin' />
        <p className='text-white/50'>Building your trip...</p>
      </div>
    </div>
  )

  if (!trip) return null
  const { userSelection, tripData } = trip

  return (
    <div className='min-h-screen relative'>

      {/* Full page background — destination specific */}
      <div
        className='fixed inset-0 bg-cover bg-center z-0 transition-all duration-1000'
        style={{ backgroundImage: `url('${heroImage || fallbackImages[0]}')` }}
      />
      <div className='fixed inset-0 bg-black/80 z-0' />

      <div className='relative z-10'>

        {/* Hero header */}
        <div className='relative h-80 overflow-hidden'>
          <img
            src={heroImage || fallbackImages[0]}
            className='w-full h-full object-cover'
            alt={userSelection?.location}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
          <div className='absolute bottom-0 left-0 right-0 px-5 sm:px-10 md:px-32 lg:px-56 pb-8'>
            <p className='text-white/50 text-xs uppercase tracking-widest mb-2'>✈️ Your AI Generated Trip</p>
            <h1 className='text-white font-black text-5xl mb-4'>{userSelection?.location}</h1>
            <div className='flex gap-3 flex-wrap'>
              <span className='bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20'>
                📅 {userSelection?.noOfDays} Days
              </span>
              <span className='bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20'>
                👥 {userSelection?.traveller}
              </span>
              <span className='bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20'>
                💰 {userSelection?.budget} Budget
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-5 sm:px-10 md:px-32 lg:px-56 py-12'>

          {/* Hotels */}
          <div className='mb-16'>
            <p className='text-white/50 text-xs uppercase tracking-widest mb-2'>Where you'll stay</p>
            <h2 className='text-white font-black text-3xl mb-6'>🏨 Hotel Recommendations</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {toArray(tripData?.hotels).map((hotel, index) => (
                <div
                  key={index}
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ' ' + hotel.hotelAddress)}`, '_blank')}
                  className='group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]'
                  style={{ height: '260px' }}
                >
                  <img
                    src={placeImages[hotel.hotelName] || fallbackImages[index % fallbackImages.length]}
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    alt={hotel.hotelName}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />

                  <div className='absolute top-4 right-4'>
                    <span className='bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full'>
                      ⭐ {hotel.rating}
                    </span>
                  </div>

                  <div className='absolute bottom-0 left-0 right-0 p-5'>
                    <h3 className='text-white font-black text-xl mb-1'>{hotel.hotelName}</h3>
                    <p className='text-white/60 text-sm mb-1'>📍 {hotel.hotelAddress}</p>
                    <p className='text-white/50 text-xs mb-2'>{hotel.description}</p>
                    <div className='flex justify-between items-center'>
                      <span className='text-white/70 text-sm'>💵 {formatPrice(hotel.price)}/night</span>
                      <span className='text-white/50 text-xs group-hover:text-white transition-colors'>
                        View on Maps →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <p className='text-white/50 text-xs uppercase tracking-widest mb-2'>Day by day</p>
            <h2 className='text-white font-black text-3xl mb-8'>🗺️ Your Itinerary</h2>

            {toArray(tripData?.itinerary).map((dayPlan, index) => (
              <div key={index} className='mb-12'>
                <div className='flex items-center gap-4 mb-5'>
                  <div
                    className='w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg'
                    style={{ boxShadow: '0 0 20px rgba(220,38,38,0.5)' }}
                  >
                    {dayPlan.day}
                  </div>
                  <h3 className='text-white font-black text-2xl'>Day {dayPlan.day}</h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {toArray(dayPlan.places).map((place, i) => (
                    <div
                      key={i}
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`, '_blank')}
                      className='group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]'
                      style={{ height: '220px' }}
                    >
                      <img
                        src={placeImages[place.placeName] || fallbackImages[(index * 3 + i) % fallbackImages.length]}
                        className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                        alt={place.placeName}
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

                      <div className='absolute top-3 left-3'>
                        <span className='bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full border border-white/20'>
                          🕐 {place.bestTimeToVisit}
                        </span>
                      </div>

                      <div className='absolute bottom-0 left-0 right-0 p-4'>
                        <h4 className='text-white font-black text-lg mb-1'>{place.placeName}</h4>
                        <p className='text-white/60 text-xs mb-2 line-clamp-2'>{place.placeDetails}</p>
                        <div className='flex justify-between items-center'>
                          <span className='text-white/50 text-xs'>🎟️ {formatPrice(place.ticketPricing)}</span>
                          <span className='text-white/50 text-xs'>⏱️ {place.timeTravel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewTrip