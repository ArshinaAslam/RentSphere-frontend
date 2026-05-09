import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
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

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs"], 
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

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
      "@typescript-eslint/no-explicit-any":         "error",
      "@typescript-eslint/no-unsafe-assignment":    "error",   
      "@typescript-eslint/no-unsafe-member-access": "error",   
      "@typescript-eslint/no-unsafe-call":          "error",   
      "@typescript-eslint/no-unsafe-return":        "error",   
      "@typescript-eslint/no-unsafe-argument":      "error",   
      "@typescript-eslint/no-floating-promises":    "error",   
      "@typescript-eslint/await-thenable":          "error",   
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