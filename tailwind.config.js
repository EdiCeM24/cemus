/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.ejs',
    './public/**/*.js',
  ],
  // purge: [
  //   '',
  //   './views/**/*.ejs',
  //   './public/src/**/*.js',
  // ],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: { 
      authCard: {
        animation: { fadeIn: '0.5s ease-in-out'},
        keyframes: {
          fadeIn: {
            '0': { opacity: 0, transform: 'translateY(20px)'},
            '100%': { opacity: 1, transform: 'translateY(0)'},
          }, 
        }, 
      },
    },
  },
  variants: {},
  plugins: [],
}

