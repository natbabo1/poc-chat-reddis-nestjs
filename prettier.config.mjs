// prettier.config.mjs
/** @type {import('prettier').Config} */
export default {
  // ------------------------------------------------------------------
  // Formatting fundamentals
  // ------------------------------------------------------------------
  printWidth: 100,          // 80 often feels cramped with modern monitors
  tabWidth: 2,              // industry standard for JS/TS
  useTabs: false,           // spaces keep alignment predictable in diffs
  semi: true,               // end every statement with `;`
  singleQuote: true,        // ' feels more natural in JS/TS than "
  trailingComma: 'all',     // cleaner diffs when adding/removing items
  bracketSpacing: true,     // `{ a: 1 }` instead of `{a:1}`
  arrowParens: 'avoid',     // `x =>` not `(x) =>` when single param
  endOfLine: 'lf',          // \n everywhere; avoids Windows/macOS mix-ups

  // ------------------------------------------------------------------
  // Language-specific niceties
  // ------------------------------------------------------------------
  overrides: [
    {
      files: '*.json',
      options: { trailingComma: 'none' }, // keep JSON strict
    },
    {
      files: ['*.yml', '*.yaml'],
      options: { singleQuote: false },    // YAML spec prefers double quotes
    },
  ],

  // ------------------------------------------------------------------
  // Experimental / project-specific (turn on if you need them)
  // ------------------------------------------------------------------
  // plugins: ['prettier-plugin-organize-imports'], // auto-organize TS imports
  // importOrder: ['^@nestjs', '^@?\\w', '^[./]'],  // customize if using the plugin
};
