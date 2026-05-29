import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Loading() {
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 mb-20'>

      {/* Header skeleton */}
      <Skeleton height={40} width={300} className='mb-4' />
      <div className='flex gap-3 mb-10'>
        <Skeleton height={35} width={100} borderRadius={20} />
        <Skeleton height={35} width={100} borderRadius={20} />
        <Skeleton height={35} width={100} borderRadius={20} />
      </div>

      {/* Hotels skeleton */}
      <Skeleton height={30} width={200} className='mb-5' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-10'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='border rounded-xl p-5'>
            <Skeleton height={20} width={180} className='mb-2' />
            <Skeleton height={15} width={220} className='mb-3' />
            <Skeleton height={15} width={150} />
          </div>
        ))}
      </div>

      {/* Itinerary skeleton */}
      <Skeleton height={30} width={220} className='mb-5' />
      {[1, 2, 3].map((day) => (
        <div key={day} className='mb-8'>
          <Skeleton height={25} width={80} className='mb-4' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[1, 2].map((i) => (
              <div key={i} className='border rounded-xl p-4'>
                <Skeleton height={15} width={100} className='mb-2' />
                <Skeleton height={20} width={160} className='mb-2' />
                <Skeleton height={15} count={2} className='mb-1' />
                <div className='flex justify-between mt-3'>
                  <Skeleton height={12} width={80} />
                  <Skeleton height={12} width={80} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading