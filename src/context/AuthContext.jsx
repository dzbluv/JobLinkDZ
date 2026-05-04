import React, { createContext, useState, useContext } from 'react'
import mockData from '../data/mockData'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login({ email, role = 'candidate' }) {
    // fake login: find profile by email in mock data
    const profile = mockData.profiles.find(p => p.email === email) || { id: 'anon', full_name: 'Guest', email, role }
    setUser({ ...profile, role })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
