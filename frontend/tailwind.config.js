/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0057B7',
        accent: '#00C896',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F8FAFC',
        textPrimary: '#1E293B'
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
