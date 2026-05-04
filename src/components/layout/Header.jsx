import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'

export default function Header(){
  const { user, logout } = useAuth()
  const { toggle } = useTheme()
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand">JobLinkDZ</Link>
        <nav>
          <Link to="/jobs">Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <button onClick={toggle} aria-label="toggle-theme">Theme</button>
        </nav>
      </div>
    </header>
  )
}
