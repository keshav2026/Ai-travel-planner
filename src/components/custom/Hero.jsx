import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

const destinations = [
  {
    name: 'Maldives',
    tagline: 'The sunny side of life',
    desc: 'Crystal clear waters, overwater bungalows and pristine white sand beaches await you.',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80',
    
  },
  {
    name: 'Taj Mahal',
    tag: 'A monument to eternal love',
    label: 'India',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80'
  },
  {
    name: 'Santorini',
    tagline: 'Where dreams meet the sea',
    desc: 'Iconic blue domes, breathtaking sunsets and charming villages carved into volcanic cliffs.',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=80',
    
  },
  {
    name: 'Rajasthan',
    tag: 'Colors of the royal desert land',
    label: 'India',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80'
  },
  {
    name: 'Kyoto',
    tagline: 'Ancient traditions, timeless beauty',
    desc: 'Serene temples, bamboo forests and cherry blossoms paint a picture of old Japan.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80',
    
  },
  {
    name: 'Patagonia',
    tagline: 'Where the world ends',
    desc: 'Dramatic landscapes of jagged peaks, glaciers and untamed wilderness at the edge of the earth.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80',
    
  },
  {
    name: 'Iceland',
    tagline: 'Land of fire and ice',
    desc: 'Witness the northern lights, geysers, volcanic landscapes and majestic waterfalls.',
    image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1600&q=80',
    
  },
  {
    name: 'Cinque Terre',
    tagline: 'Where colors meet the sea',
    desc: 'Dramatic cliffs, colorful villages and the sparkling Mediterranean at golden hour.',
    image: '/images/mountain-river.jpg',
    
  },
  {
    name: 'Paris',
    tag: 'The city of light and romance',
    label: 'France',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1600&q=80',
    position: 'down center',
  },
  {
    name: 'Swiss Alps',
    tag: 'Where every peak tells a story',
    label: 'Europe',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80'
  },
  {
    name: 'Venice',
    tagline: 'La Serenissima',
    desc: 'Ancient canals, gondolas and centuries of art and culture in a city like no other.',
    image: '/images/venice-river-sunset.jpg',
    
  },
  {
    name: 'Tropical Paradise',
    tagline: 'Where time stands still',
    desc: 'Turquoise lagoons, infinity pools and the sound of waves in an untouched paradise.',
    image: '/images/infinity-pool.jpg',
    
  },
  {
    name: 'Open Waters',
    tagline: 'Feel the freedom',
    desc: 'Set sail across crystal blue seas and discover the world from a whole new perspective.',
    image: '/images/sailing.jpg',
    
  },
  {
    name: 'Hidden Beaches',
    tagline: 'Escape the ordinary',
    desc: 'Discover secluded coves, turquoise waters and untouched shores from above.',
    image: '/images/aerial-beach.jpg',
    
  },
  {
    name: 'Sunset Beach',
    tagline: 'Where every evening is magic',
    desc: 'Golden sunsets, warm sand and the gentle sound of waves on a perfect tropical shore.',
    image: '/images/beach-sunset.jpg',
    
  },
]

function Hero() {
  const { isDark } = useTheme()
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  // Preload all images so transitions are smooth
  useEffect(() => {
    destinations.forEach(dest => {
      const img = new Image()
      img.src = dest.image
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % destinations.length)
        setFade(true)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const dest = destinations[current]

  return (
    <div className='relative w-full flex-1 overflow-hidden' style={{ height: '100%' }}>

      {/* Render ALL images stacked, show only current one */}
      {destinations.map((d, i) => (
        <div
          key={i}
          className='absolute inset-0 bg-cover bg-center transition-opacity duration-700'
          style={{
            backgroundImage: `url(${d.image})`,
            opacity: i === current ? (fade ? 1 : 0) : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className='absolute inset-0 bg-black/50' />

      {/* Gradient overlay at bottom */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

      {/* Content */}
      <div
        className='relative z-10 flex flex-col justify-end h-screen px-10 md:px-20 pb-20'
        style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <div className='max-w-3xl'>
          <p className='text-white/60 text-sm uppercase tracking-widest mb-3 font-medium'>
            ✈️ Featured Destination
          </p>
          <h1 className='text-6xl md:text-8xl font-bold text-white mb-3 leading-none tracking-tight'>
            {dest.name}
          </h1>
          <p className='text-white/70 text-xl md:text-2xl italic mb-4'>
            {dest.tagline}
          </p>
          <p className='text-white/60 text-base md:text-lg max-w-xl mb-8'>
            {dest.desc}
          </p>

          <div className='flex gap-4'>
  <Link to="/create-trip">
    <button className='bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/30 hover:bg-white/25 transition-all hover:scale-105'>
      Start Planning ✈️
    </button>
  </Link>
  <Link to="/my-trips">
    <button className='bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all'>
      My Trips
    </button>
  </Link>
</div>
        </div>

        {/* Dots indicator */}
        <div className='flex gap-2 mt-10'>
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFade(false)
                setTimeout(() => { setCurrent(i); setFade(true) }, 500)
              }}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className='absolute bottom-20 right-10 text-white/40 text-sm font-mono'>
          {String(current + 1).padStart(2, '0')} / {String(destinations.length).padStart(2, '0')}
        </div>
      </div>

      {/* Stats */}
      <div className='absolute top-24 right-10 z-10 flex flex-col gap-4'>
        {[
          { number: '10K+', label: 'Trips Planned' },
          { number: '150+', label: 'Destinations' },
          { number: '4.9⭐', label: 'User Rating' },
        ].map((stat, i) => (
          <div key={i} className='text-right'>
            <p className='text-2xl font-bold text-white'>{stat.number}</p>
            <p className='text-white/40 text-xs'>{stat.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Hero