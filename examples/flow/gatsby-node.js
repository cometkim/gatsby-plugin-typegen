exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: require.resolve('@babel/preset-flow'),
  });
};
