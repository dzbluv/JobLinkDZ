import React, { useEffect, useState } from 'react'
import { fetchApplicationsByCandidate } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/layout/Header'

export default function Dashboard(){
  const { user } = useAuth()
  const [apps, setApps] = useState([])

  useEffect(()=>{
    if(user) fetchApplicationsByCandidate(user.id).then(setApps)
  },[user])

  if(!user) return <div>Please login</div>

  return (
    <div>
      <Header />
      <main className="container">
        <h2>Your Applications</h2>
        <ul>
          {apps.map(a=> (
            <li key={a.id}>{a.job_offer_id} — {a.status}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}
