import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('candidate')
  const { login } = useAuth()
  const nav = useNavigate()

  function onSubmit(e){
    e.preventDefault()
    login({ email, role })
    nav('/')
  }

  return (
    <main className="container">
      <h2>Login (mock)</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="candidate">Candidate</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
