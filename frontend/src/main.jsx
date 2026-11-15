import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// When deployed, the backend lives on another host. VITE_API_URL points to it.
// Locally it is empty, so the Vite dev proxy keeps handling /api calls.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
if (API_URL) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init) =>
    originalFetch(
      typeof input === 'string' && input.startsWith('/api') ? API_URL + input : input,
      init
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
