import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The shape rule (DESIGN.md → Shape): our screens use the radius tokens, never bigger steps
// or one-off values. Vendored ui/ components are capped by the theme instead.
const OFF_RULE_RADIUS = /(?:^|[\s:])rounded(?:-[trblse]{1,2})?-(?:2xl|3xl|4xl|\[)/;
const shapePlugin = {
  rules: {
    "radius-tokens": {
      meta: { type: "problem", schema: [] },
      create(context) {
        const check = (node, text) => {
          if (OFF_RULE_RADIUS.test(text)) {
            context.report({ node, message: "Use rounded-card, rounded-inner or rounded-thumb for boxes (DESIGN.md → Shape)." });
          }
        };
        return {
          Literal: (node) => typeof node.value === "string" && check(node, node.value),
          TemplateElement: (node) => check(node, node.value.raw),
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/**/*.tsx", "src/components/app/**/*.tsx", "src/components/landing/**/*.tsx"],
    plugins: { clippifi: shapePlugin },
    rules: { "clippifi/radius-tokens": "error" },
  },
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
