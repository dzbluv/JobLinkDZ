import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState('dark')

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
  },[theme])

  function toggle(){ setTheme(t=> t === 'dark' ? 'light' : 'dark') }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){ return useContext(ThemeContext) }
