module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@cometjs',
  ],
  extends: [
    'plugin:@cometjs/base',
    'plugin:@cometjs/typescript',
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
