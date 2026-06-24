// Shared PostCSS config for all apps (Tailwind v4 — CSS-first, no tailwind.config).
// Tokens / @theme / globals live in @repo/ui (globals.css).
const config = {
  plugins: ["@tailwindcss/postcss"],
};

module.exports = config;
