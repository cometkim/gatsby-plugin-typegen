module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
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
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
  },
};
