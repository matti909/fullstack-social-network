// ESLint flat config — obligatorio en ESLint 10 (.eslintrc.json ya no lo lee).
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Desactiva las reglas de formato de ESLint: el formato lo decide Prettier
  // (conform.nvim al guardar). Asi no te pelean dos formateadores.
  prettierConfig,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "warn",
    },
  },
);
