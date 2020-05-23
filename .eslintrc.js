module.exports = {
  env: {
    node: true,
  },
  plugins: [
    '@cometjs',
  ],
  extends: [
    'plugin:@cometjs/base',
    'plugin:@cometjs/typescript',
  ],
};
