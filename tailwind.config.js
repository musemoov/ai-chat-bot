/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        meteor: {
          "0%": {
            transform: "translate(0, 0) rotate(45deg)",
            opacity: "1",
          },
          "50%": {
            transform: "translate(110px, 300px) rotate(65deg)",
            opacity: "0.5",
          },
          "100%": {
            transform: "translate(300px, 800px) rotate(90deg)",
            opacity: "0",
          },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        "meteor-effect": "meteor linear infinite",
        twinkle: 'twinkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}
