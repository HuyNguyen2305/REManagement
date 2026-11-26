import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const config = [
  {
    ignores: [
      "node_modules/",
      ".agents/",
      ".claude/",
      "graphify-out/",
      ".next/",
      "next-env.d.ts",
      "playwright-report/",
      "test-results/",
      "coverage/",
    ],
  },
  ...nextVitals,
  ...nextTs,
  prettier,
];

export default config;
