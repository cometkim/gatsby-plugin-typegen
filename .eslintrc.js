module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    project: [
      './tsconfig.json',
      './plugin/tsconfig.json',
      './examples/**/tsconfig.json',
    ],
  },
  plugins: [
    '@cometjs',
  ],
  extends: [
    'plugin:@cometjs/auto',
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
