import React from 'react'

export default function Button({ children, onClick, className = '', ...props }){
  return (
    <button onClick={onClick} className={`btn ${className}`} {...props}>
      {children}
    </button>
  )
}
