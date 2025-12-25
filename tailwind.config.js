/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0F0B1E",
        secondary: "#8B5CF6",
        black: {
          DEFAULT: "#1A1625",
          100: "#1A1625",
          200: "#252030",
        },
        gray: {
          100: "#E5E7EB",
        },
      },
    },
  },
  plugins: [],
};
