import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes/Router'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
