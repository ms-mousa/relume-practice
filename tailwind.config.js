/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['resources/views/**/*.edge', 'resources/js/app.js', 'resources/js/utils.ts'],
  daisyui: {
    themes: ['light', 'dark', 'winter'],
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      height: {
        app: 'calc(100vh - 7.25rem)',
      },
      gridTemplateRows: {
        app: '4rem 1fr 3rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
