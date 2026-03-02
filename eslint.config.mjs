import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
  // ── Ignore ───────────────────────────────────────────────────────────────
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      
      "next-env.d.ts",
      "node_modules/**",
      "dist/**",
    ],
  },

  // ── Base JS + TypeScript ──────────────────────────────────────────────────
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // ── Next.js rules ─────────────────────────────────────────────────────────
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // ── TypeScript parser ─────────────────────────────────────────────────────
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ── Main rules ────────────────────────────────────────────────────────────
  {
    plugins: {
      import: importPlugin,
    },

    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },

    rules: {
      // ── TypeScript ─────────────────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any":         "warn",
      "@typescript-eslint/no-unsafe-assignment":    "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call":          "warn",
      "@typescript-eslint/no-unsafe-return":        "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      // ── Import order ───────────────────────────────────────────────────────
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            { pattern: "react",   group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/**",    group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",

      // ── General ────────────────────────────────────────────────────────────
      "no-console":   ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var":       "error",
    },
  },
]);

export default eslintConfig;