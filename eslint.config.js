const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["app/**/*.{ts,tsx}", "__tests__/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/src/modules/*/*", "@/src/modules/*/*/**"],
          message: "モジュール内ファイルへの直接アクセスは禁止です。index.ts経由でimportしてください。",
        }],
      }],
    },
  },
]);
