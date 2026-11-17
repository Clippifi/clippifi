import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Animate UI internals (installed via the shadcn registry, not our code).
    // Our styled wrappers in src/components/animate-ui/components/ are still linted.
    "src/components/animate-ui/primitives/**",
    "src/hooks/use-auto-height.tsx",
    "src/hooks/use-controlled-state.tsx",
  ]),
]);

export default eslintConfig;
