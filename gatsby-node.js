"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.onPostBootstrap = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _crypto = _interopRequireDefault(require("crypto"));

var _chokidar = _interopRequireDefault(require("chokidar"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _util = require("util");

var _core = require("@graphql-codegen/core");

var typescriptPlugin = _interopRequireWildcard(require("@graphql-codegen/typescript"));

var typescriptOperationsPlugin = _interopRequireWildcard(require("@graphql-codegen/typescript-operations"));

var typescriptResolversPlugin = _interopRequireWildcard(require("@graphql-codegen/typescript-resolvers"));

var _graphqlToolkit = require("graphql-toolkit");

var _graphql = require("gatsby/graphql");

function _wrapRegExp(re, groups) { _wrapRegExp = function (re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = (0, _wrapNativeSuper2.default)(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } (0, _inherits2.default)(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (typeof args[args.length - 1] !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

const writeFilePromise = (0, _util.promisify)(_fs.default.writeFile);

const resolve = (...paths) => _path.default.resolve(process.cwd(), ...paths);

const log = message => console.log(`[gatsby-plugin-typegen] ${message}`);

const DOCUMENTS_GLOB = resolve('src/**/*.{ts,tsx}');
const DEFAULT_SCHEMA_OUTPUT_PATH = resolve('.cache/caches/gatsby-plugin-typegen/schema.json');
const DEFAULT_TYPE_DEFS_OUTPUT_PATH = resolve('node_modules/generated/types/gatsby.ts');
/**
 * (?<CallExpressionName>useStaticQuery
 *   (?<TypeTemplate><
 *     (?<TypeArgument>\S*)
 *   >)?
 * )
 * \([\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */

const STATIC_QUERY_HOOK_REGEXP = _wrapRegExp(/(useStaticQuery(<(\S*)>)?)\([\s\S]*?graphql(`\s*?(query (\S*)[^{]{)[^`]*?`)/g, {
  CallExpressionName: 1,
  TypeTemplate: 2,
  TypeArgument: 3,
  TemplateLiteral: 4,
  QueryDefinitionStart: 5,
  QueryName: 6
});

const STATIC_QUERY_HOOK_REPLACER = (substring, ...args) => {
  const {
    length: l,
    [l - 1]: groups
  } = args;
  return substring.replace(groups['CallExpressionName'], `useStaticQuery<${groups['QueryName']}Query>`);
};
/**
 * (?<JsxTagOpening><StaticQuery
 *   (?<TagTypeTemplate><
 *     (?<TagTypeArgument>\S+)
 *   >)?
 * )
 * [\s\S]+?
 * query={
 * [\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */


const STATIC_QUERY_COMPONENT_REGEXP = _wrapRegExp(/(<StaticQuery(<(\S+)>)?)[\s\S]+?query={[\s\S]*?graphql(`\s*?(query (\S*)[^{]?\{)[^`]*`)/g, {
  JsxTagOpening: 1,
  TagTypeTemplate: 2,
  TagTypeArgument: 3,
  TemplateLiteral: 4,
  QueryDefinitionStart: 5,
  QueryName: 6
});

const STATIC_QUERY_COMPONENT_REPLACER = (substring, ...args) => {
  const {
    length: l,
    [l - 1]: groups
  } = args;
  return substring.replace(groups['JsxTagOpening'], `<StaticQuery<${groups['QueryName']}Query>`);
};

const onPostBootstrap = async ({
  store
}, options) => {
  const {
    schemaOutputPath = DEFAULT_SCHEMA_OUTPUT_PATH,
    typeDefsOutputPath = DEFAULT_TYPE_DEFS_OUTPUT_PATH,
    autoFix = true
  } = options;
  let cache = '';

  const extractSchema = async () => {
    const {
      schema
    } = store.getState();
    const {
      data: fullSchema
    } = await (0, _graphql.graphql)(schema, _graphql.introspectionQuery);
    const output = JSON.stringify(fullSchema, null, 2);

    const sha1sum = _crypto.default.createHash('sha1').update(output).digest('hex');

    if (cache !== sha1sum) {
      cache = sha1sum;
      await writeFilePromise(schemaOutputPath, output, 'utf-8');
      log(`Schema file extracted to ${schemaOutputPath}!`);
    }
  }; // Wait for first extraction


  await extractSchema();
  const schemaAst = await (0, _graphqlToolkit.loadSchema)(schemaOutputPath);
  const documents = await (0, _graphqlToolkit.loadDocuments)(resolve(DOCUMENTS_GLOB));
  log('Documents are loaded');
  const config = {
    schemaAst,
    filename: typeDefsOutputPath,
    plugins: [{
      typescript: {}
    }, {
      typescriptOperations: {}
    }, {
      typescriptResolvers: {}
    }],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptOperations: typescriptOperationsPlugin,
      typescriptResolvers: typescriptResolversPlugin
    },
    config: {
      avoidOptionals: true,
      maybeValue: 'T',
      namingConvention: {
        typeNames: 'keep',
        enumValues: 'keep',
        transformUnderscore: false
      },
      addUnderscoreToArgsType: true,
      skipTypename: true
    }
  };
  const writeTypeDefinition = (0, _lodash.default)(async () => {
    // @ts-ignore
    const output = await (0, _core.codegen)({ ...config,
      documents
    });
    await _fs.default.promises.mkdir(_path.default.dirname(typeDefsOutputPath), {
      recursive: true
    });
    await _fs.default.promises.writeFile(typeDefsOutputPath, output, 'utf-8');
    log(`Type definitions are generated into ${typeDefsOutputPath}`);
  }, 1000);

  const fixDocuments = async filePath => {
    const code = await _fs.default.promises.readFile(filePath, 'utf-8');
    const fixed = code.replace(STATIC_QUERY_HOOK_REGEXP, STATIC_QUERY_HOOK_REPLACER).replace(STATIC_QUERY_COMPONENT_REGEXP, STATIC_QUERY_COMPONENT_REPLACER);

    if (code !== fixed) {
      _fs.default.promises.writeFile(filePath, fixed, 'utf-8');
    }
  };

  const onWatch = async filePath => {
    const changed = documents.findIndex(document => document.filePath === filePath);

    if (changed !== -1) {
      documents[changed] = (await (0, _graphqlToolkit.loadDocuments)(filePath))[0];
    }

    writeTypeDefinition();

    if (autoFix && filePath !== schemaOutputPath) {
      fixDocuments(filePath);
    }
  };

  const watcher = _chokidar.default.watch([schemaOutputPath, DOCUMENTS_GLOB]);

  watcher.on('add', onWatch).on('change', onWatch);
  store.subscribe(extractSchema);
};

exports.onPostBootstrap = onPostBootstrap;