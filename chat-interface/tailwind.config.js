/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/reachat/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // ========================================
        // RETARGETIQ BRAND COLORS
        // Extracted from retargetiq.com CSS variables
        // ========================================

        brand: {
          // Primary - Cyan/Teal accent (--brz-global-color3)
          primary: '#47C2EB',
          'primary-dark': '#3A9AB9',    // --brz-global-color4
          'primary-light': '#6DD0F0',

          // Text colors
          'text-dark': '#111828',        // --brz-global-color1 (headings)
          'text-body': '#333333',        // --brz-global-color7 (body)

          // Neutral backgrounds
          'bg-primary': '#FFFFFF',       // --brz-global-color8
          'bg-secondary': '#F6FCFE',     // --brz-global-color5
          'bg-chat': '#F6FCFE',
        },

        // Chat-specific colors
        chat: {
          'user-bubble': '#47C2EB',      // Primary cyan
          'ai-bubble': '#FFFFFF',
          'user-text': '#FFFFFF',
          'ai-text': '#111828',          // Dark navy text
          'border': '#EBEBEB',           // --brz-global-color6
          'input-bg': '#F6FCFE',
        }
      },

      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Overpass', 'sans-serif'],
      },

      borderRadius: {
        'bubble': '16px',
        'input': '24px',
        'container': '12px',
      },

      boxShadow: {
        'chat': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'bubble': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'input': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-dot': 'pulseDot 1.4s infinite ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
