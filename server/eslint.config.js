import oxlint from 'eslint-plugin-oxlint';
import neverthrow from "eslint-plugin-neverthrow"

export default [
  neverthrow,
  ...oxlint.configs['flat/recommended'], // oxlint should be the last one
];