import React, { useEffect, useState } from 'react'
import { db } from '@/service/firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

function MyTrips({ user }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState({})
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const navigate = useNavigate()
  const { isDark } = useTheme()

  useEffect(() => {
    if (user) getUserTrips()
  }, [user])

  const getUserTrips = async () => {
    const q = query(
      collection(db, 'AITrips'),
      where('userEmail', '==', user.email)
    )
    const querySnapshot = await getDocs(q)
    const tripsList = []
    querySnapshot.forEach((doc) => tripsList.push(doc.data()))
    setTrips(tripsList)
    setLoading(false)
    fetchImages(tripsList)
  }

  const fetchImages = async (tripsList) => {
    const imageMap = {}
    await Promise.all(
      tripsList.map(async (trip) => {
        const location = trip.userSelection?.location
        if (!location) return
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
          )
          const data = await res.json()
          if (data.results?.[0]) {
            imageMap[trip.id] = data.results[0].urls.regular
          }
        } catch (e) {
          console.error('Image fetch failed:', e)
        }
      })
    )
    setImages(imageMap)
  }

  const filteredTrips = trips
    .filter(trip =>
      trip.userSelection?.location?.toLowerCase().includes(search.toLowerCase()) ||
      trip.userSelection?.budget?.toLowerCase().includes(search.toLowerCase()) ||
      trip.userSelection?.traveller?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? Number(b.id) - Number(a.id)
        : Number(a.id) - Number(b.id)
    )

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#0a0f1e]' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'}`}>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin' />
        <p className={`text-lg ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Loading your trips...</p>
      </div>
    </div>
  )

  return (
  <div className='min-h-screen relative'>

    {/* Full page background */}
    <div
      className='fixed inset-0 bg-cover bg-center z-0'
      style={{ backgroundImage: `url('/images/aerial-beach.jpg')` }}
    />
    <div className='fixed inset-0 bg-black/75 z-0' />

    {/* All existing content wrapped in relative z-10 */}
    <div className='relative z-10 pt-24 pb-20 sm:px-10 md:px-32 lg:px-48 xl:px-64 px-5'>

      {/* Page header */}
      <div className='mb-8'>
        <p className='text-red-500 text-xs font-bold uppercase tracking-widest mb-2'>✈ Your Adventures</p>
        <h1 className='font-black text-4xl text-white'>My Trips</h1>
        <p className='mt-1 text-sm text-white/40'>
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned so far
        </p>
      </div>

      {/* Search & Sort bar */}
      {trips.length > 0 && (
        <div className='flex gap-3 mb-8 flex-wrap'>
          <input
            type='text'
            placeholder='🔍 Search destination, budget, traveller...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 min-w-[200px] px-4 py-2 rounded-full text-sm outline-none border transition-all bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/30 focus:border-red-500'
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className='px-4 py-2 rounded-full text-sm outline-none border transition-all cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 text-white'
          >
            <option value='newest' className='bg-gray-900'>Newest First</option>
            <option value='oldest' className='bg-gray-900'>Oldest First</option>
          </select>
        </div>
      )}

      {trips.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-[50vh] gap-6 border rounded-2xl border-red-900/40 bg-white/5 backdrop-blur-sm'>
          <div className='text-6xl'>🗺️</div>
          <div className='text-center'>
            <p className='text-xl font-bold mb-1 text-white'>No trips yet!</p>
            <p className='text-sm text-white/40'>Start planning your first adventure</p>
          </div>
          <button
            className='text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 bg-red-600'
            style={{ boxShadow: '0 0 20px rgba(220,38,38,0.4)' }}
            onClick={() => navigate('/create-trip')}
          >
            ✈ Plan Your First Trip
          </button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-[30vh] gap-3'>
          <p className='text-4xl'>🔍</p>
          <p className='text-lg font-bold text-white/50'>No trips match your search</p>
          <button onClick={() => setSearch('')} className='text-red-500 text-sm underline'>Clear search</button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/view-trip/${trip.id}`)}
              className='group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]'
              style={{
                height: '340px',
                boxShadow: '0 0 20px rgba(220,38,38,0.25)',
              }}
            >
              {images[trip.id] ? (
                <img
                  src={images[trip.id]}
                  alt={trip.userSelection?.location}
                  className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
              ) : (
                <div className='absolute inset-0 bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center text-6xl'>
                  🌍
                </div>
              )}

              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10' />

              <div className='absolute top-4 left-4 right-4 flex justify-between items-start'>
                <span className='bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full'
                  style={{ boxShadow: '0 0 12px rgba(220,38,38,0.6)' }}>
                  {trip.userSelection?.noOfDays} Days
                </span>
                <span className='bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20'>
                  💰 {trip.userSelection?.budget}
                </span>
              </div>

              <div className='absolute bottom-0 left-0 right-0 p-5'>
                <p className='text-red-400 text-xs font-bold uppercase tracking-widest mb-1'>
                  ✈ {trip.userSelection?.traveller}
                </p>
                <h3 className='text-white font-black text-2xl leading-tight mb-3 drop-shadow-lg'>
                  {trip.userSelection?.location}
                </h3>
                <div className='flex items-center justify-between'>
                  <div className='flex gap-2'>
                    <span className='bg-white/15 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20'>
                      📅 {trip.userSelection?.noOfDays} days
                    </span>
                    <span className='bg-white/15 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20'>
                      👥 {trip.userSelection?.traveller}
                    </span>
                  </div>
                  <span className='text-white/70 text-xs font-semibold flex items-center gap-1 group-hover:text-red-400 transition-colors'>
                    View Trip
                    <span className='group-hover:translate-x-1 transition-transform inline-block'>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Add new trip card */}
          <div
            onClick={() => navigate('/create-trip')}
            className='rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.03] border-red-900/40 hover:border-red-500/60 backdrop-blur-sm bg-white/5'
            style={{ height: '340px' }}
          >
            <div className='w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 bg-white/5'>
              ✈
            </div>
            <p className='font-bold text-base text-white/40'>Plan a new trip</p>
            <p className='text-xs mt-1 text-white/20'>Click to get started</p>
          </div>
        </div>
      )}
    </div>
  </div>
)
}

export default MyTrips