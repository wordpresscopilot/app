import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        gradient: "gradient 8s linear infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        pulse: "pulse var(--duration) ease-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "spin-medium": "spin 2s linear infinite",
        "spin-fast": "spin 1s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontSize: {
        "2xs": [
          "0.625rem",
          {
            lineHeight: "0.75rem",
          },
        ],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        pulse: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 var(--pulse-color)",
          },
          "50%": {
            boxShadow: "0 0 0 8px var(--pulse-color)",
          },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animationDelay: {
        25: "25ms",
        50: "50ms",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        250: "250ms",
        300: "300ms",
        350: "350ms",
        400: "400ms",
        450: "450ms",
        500: "500ms",
        550: "550ms",
        600: "600ms",
        650: "650ms",
        700: "700ms",
        750: "750ms",
        800: "800ms",
        850: "850ms",
        900: "900ms",
        950: "950ms",
        1000: "1000ms",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@assistant-ui/react/tailwindcss"),
    plugin(({ addUtilities, theme }) => {
      const animationDelays = theme("animationDelay") as Record<string, string>;
      const utilities = Object.entries(animationDelays).map(([key, value]) => ({
        [`.delay-${key}`]: {
          animationDelay: value,
          animationFillMode: "backwards",
        },
      }));
      addUtilities(utilities);
    }),
  ],
} satisfies Config;

export default config;
