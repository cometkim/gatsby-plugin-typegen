exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: require.resolve('@babel/preset-flow'),
  });
};

exports.pluginOptionsSchema = ({ Joi }) => Joi.object({});
