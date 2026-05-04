import React, { useEffect, useState } from 'react'
import { fetchJobs } from '../services/api'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function JobsList(){
  const [jobs, setJobs] = useState([])
  useEffect(()=>{ fetchJobs().then(setJobs) },[])
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Job Offers</h2>
        <ul className="jobs-grid">
          {jobs.map(j=> (
            <li key={j.id} className="job-card">
              <h3>{j.title}</h3>
              <p>{j.company} — {j.location}</p>
              <Link to={`/jobs/${j.id}`}>View</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
