import React from 'react'
import Header from '../../components/layout/Header'

export default function JobManager(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Admin — Job Manager (mock)</h2>
        <p>Create, edit and review job offers here. Integration with Supabase will be added later.</p>
      </main>
    </div>
  )
}
