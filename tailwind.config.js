/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,vue}"
  ],
  theme: {
    extend: {

      colors: {
        navbar: "#4A6074",
        navyellow: "#FFBC00",
        popup_bg: "#18112db8",
        pink: "#FFB8B8",
        x:"#ffddeb",
        modal_bg: "#18112db8",
        

       
      },
      backgroundImage: {
        ankara: "url('../public/images/background.jpg')",
        istanbul: "url('../public/images/istanbul-1.jpg')",
      },
      
      
    },
  },
  plugins: [],
}

