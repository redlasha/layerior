import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5A3D',
          light: '#F0F7F2',
        },
        surface: '#FFFFFF',
        background: '#F6F4F0',
        border: '#E8E8E8',
        danger: '#C0392B',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        'text-muted': '#AAAAAA',
      },
      fontFamily: {
        pretendard: ['Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
