import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchJobById, applyToJob } from '../services/api'
import Header from '../components/layout/Header'
import { useAuth } from '../hooks/useAuth'

export default function JobDetails(){
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const { user } = useAuth()
  const [message, setMessage] = useState('')

  useEffect(()=>{ fetchJobById(id).then(setJob) },[id])

  async function onApply(){
    if(!user) return alert('Login to apply')
    await applyToJob({ candidate_id: user.id, job_offer_id: job.id, cover_message: message })
    alert('Application submitted (mock)')
  }

  if(!job) return <div>Loading...</div>
  return (
    <div>
      <Header />
      <main className="container">
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p>{job.description}</p>
        <hr />
        <h3>Apply</h3>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Cover message" />
        <button onClick={onApply}>Apply (mock)</button>
      </main>
    </div>
  )
}
