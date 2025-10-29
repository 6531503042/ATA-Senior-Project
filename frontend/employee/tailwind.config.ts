import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/theme'; 
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: { extend: {} },
  plugins: [animate, heroui()],  
};

export default config;
