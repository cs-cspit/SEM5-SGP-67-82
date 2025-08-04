// client/tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    // ... existing content
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6',
          dark: '#2563EB',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}