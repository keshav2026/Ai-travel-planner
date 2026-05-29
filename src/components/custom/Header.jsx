import React from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '@/service/firebaseConfig'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

function Header({ user, setUser }) {
  const { isDark, toggleTheme } = useTheme()

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className='fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center'
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)'
      }}
    >
      {/* Logo */}
      <Link to="/">
        <div className='flex flex-col'>
          <span className='text-white font-black text-2xl tracking-tight'>
            PLAN<span className='text-red-500'>AWAY</span>
          </span>
          <span className='text-white/40 text-xs tracking-widest uppercase'>
            Your AI Travel Planner
          </span>
        </div>
      </Link>

      {/* Right side */}
      <div className='flex items-center gap-6'>
        {user ? (
          <>
            
            <img
              src={user.photoURL}
              alt={user.displayName}
              className='w-9 h-9 rounded-full border-2 border-white/30'
            />
            <button
              onClick={handleSignOut}
              className='text-white/80 hover:text-white text-sm font-medium px-5 py-2 rounded-full border border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all'
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className='text-white text-sm font-medium px-5 py-2 rounded-full border border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all'
          >
            Sign in
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className='w-9 h-9 rounded-full flex items-center justify-center text-base border border-white/30 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm'
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}

export default Header