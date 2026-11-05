/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hollow: {
          abyss: "#0A0612",       // Deepest midnight dungeon
          bg: "#10091D",          // Ambient midnight violet
          surface: "#170E2B",     // Haunted stone surface
          card: "#1E1238",        // Primary 3D game card
          cardHover: "#28184C",   // Elevated hover surface
          border: "#3E256C",      // Inscribed rune border
          borderGlow: "#7C3AED",  // Arcane active border
          amber: "#FF7A00",       // Pumpkin flame ember
          amberGlow: "#FFA338",   // Bright ember light
          gold: "#F59E0B",        // Ancient relic gold
          purple: "#A855F7",      // Arcane midnight purple
          lavender: "#C084FC",    // Mystical wisp lavender
          cyan: "#06B6D4",        // Spirit soul flame
          emerald: "#10B981",     // Sanctuary ward green
          crimson: "#FF2E63",     // Cursed bloodfang red
          text: "#F3EEFF",        // Pure spirit ivory
          muted: "#9D8EC0"        // Ancient stone text
        },
        ghost: {
          bg: "#10091D",
          card: "#1E1238",
          cardHover: "#28184C",
          border: "#3E256C",
          orange: "#FF7A00",
          lavender: "#A855F7",
          danger: "#FF2E63",
          green: "#10B981",
          muted: "#9D8EC0",
          text: "#F3EEFF"
        }
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-3d': 'float3D 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse': 'spinReverse 24s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'rune-glow': 'runeGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float3D: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(4deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.02)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        runeGlow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 5px rgba(255,122,0,0.3))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 15px rgba(255,122,0,0.8))' },
        }
      }
    },
  },
  plugins: [],
}
