import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function Home(){
  return (
    <div>
      <Header />
      <main className="container">
        <h1>Welcome to JobLinkDZ</h1>
        <p>Find and apply to jobs — modern UI ready for Supabase integration.</p>
      </main>
      <Footer />
    </div>
  )
}
