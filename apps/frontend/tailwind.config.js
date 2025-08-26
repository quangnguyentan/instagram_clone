/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb",
      },
    },
  },
  plugins: [],
};
