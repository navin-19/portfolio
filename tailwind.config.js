/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      xs: "0px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
    },
    extend: {
      colors: {
        primary: "rgba(45, 83, 218, 1)",
      },
      boxShadow: {
        custom: "0px 4.75px 32.06px 0px #00000017",
      },
    },
  },
  plugins: [],
}