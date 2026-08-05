import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Impeccable submodule (skill vendor) — no lintamos código de terceros.
      ".impeccable/**",
      ".opencode/**",
      // Salidas generadas.
      ".next/types/**",
    ],
  },
];

export default eslintConfig;
