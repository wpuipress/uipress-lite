import { scopedPreflightStyles, isolateInsideOfContainer } from "tailwindcss-scoped-preflight";

/** @type {import('tailwindcss').Config} */
export default {
  //content: ["./src/**/*.{js,ts,jsx,tsx,vue}"],
  content: ["./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(".uipress-normalizesdfv:not(.uip-body)", {}),
    }),
  ],
};
