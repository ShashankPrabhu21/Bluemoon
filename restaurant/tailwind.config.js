
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Adjust paths based on your folder structure
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: {
          400: '#60a5fa',
          500: '#3b82f6',
        },
      },
    },
  },  
  plugins: [],
}


