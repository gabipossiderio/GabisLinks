/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['sans-serif'],
      cursive: ['Rancho', 'cursive'],
      text: ['Manrope', 'sans-serif'],
      menu: ['Nunito', 'sans-serif']
    },
  },
  plugins: [],
}