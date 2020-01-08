module.exports = {
  presets: [
    '@babel/preset-typescript',
    'babel-preset-gatsby-package',
  ],
  plugins: [
    '@babel/plugin-transform-named-capturing-groups-regex',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
