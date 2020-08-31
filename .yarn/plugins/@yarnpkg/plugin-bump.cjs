/* eslint-disable*/
module.exports = {
  name: "@yarnpkg/plugin-bump",
  factory: function (require) {
                          var plugin =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  "use strict";


  var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const bump_1 = __importDefault(__webpack_require__(1));

  const plugin = {
    commands: [bump_1.default]
  };
  exports.default = plugin;

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {

  "use strict";


  var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const clipanion_1 = __webpack_require__(2);

  const cli_1 = __webpack_require__(3);

  const core_1 = __webpack_require__(4);

  const plugin_essentials_1 = __importDefault(__webpack_require__(5));

  class BumpCommand extends cli_1.BaseCommand {
    constructor() {
      super(...arguments);
      this.packages = [];
      this.exclude = [];
      this.dependencyKind = 'all';
    }

    getDependencies(workspace) {
      const dependencies = workspace.manifest.dependencies;

      if (this.dependencyKind === 'production') {
        return dependencies;
      }

      const devDependencies = workspace.manifest.devDependencies;

      if (this.dependencyKind === 'development') {
        return devDependencies;
      }

      return new Map([...dependencies, ...devDependencies]);
    }

    resolveFullPackageName({
      scope,
      name
    }) {
      return scope ? `@${scope}/${name}` : name;
    }

    async execute() {
      if (!plugin_essentials_1.default.commands) {
        throw new Error(`Yarn commands could not be loaded.
  Please upgrade to Yarn 2.`);
      }

      const configuration = await core_1.Configuration.find(this.context.cwd, this.context.plugins);
      const {
        project
      } = await core_1.Project.find(configuration, this.context.cwd);

      for (const workspace of project.workspaces) {
        const dependencies = this.getDependencies(workspace);
        const descriptors = [...dependencies.values()].filter(descriptor => this.resolveFullPackageName(descriptor).match(this.packages.join('|') || '.*')).filter(descriptor => !this.resolveFullPackageName(descriptor).match(this.exclude.join('|') || null));
        const packageNames = descriptors.map(this.resolveFullPackageName);
        const cli = clipanion_1.Cli.from(plugin_essentials_1.default.commands);
        await cli.runExit(['up', ...packageNames], this.context);
      }
    }

  }

  BumpCommand.usage = clipanion_1.Command.Usage({
    description: 'A Yarn 2 plugin to easily upgrade dependencies.',
    details: 'A Yarn 2 plugin for upgrading PnP-mode dependencies easily' + ' with a dead-simple command and no waste of interactions.',
    examples: [['Upgrade all dependencies', 'yarn bump'], ['Upgrade only the lodash package', 'yarn bump ^lodash$'], ['Upgrade packages match with "^gatsby-*"', 'yarn bump "^gatsby-*"'], ['Upgrade only exclude react and react-dom', 'yarn bump --exclude react --exclude react-dom'], ['Upgrade only development dependencies', 'yarn bump --kind development'], ['Upgrade only production dependencies', 'yarn bump --kind production']]
  });

  __decorate([clipanion_1.Command.Rest()], BumpCommand.prototype, "packages", void 0);

  __decorate([clipanion_1.Command.Array('--exclude')], BumpCommand.prototype, "exclude", void 0);

  __decorate([clipanion_1.Command.String('--kind')], BumpCommand.prototype, "dependencyKind", void 0);

  __decorate([clipanion_1.Command.Path('bump')], BumpCommand.prototype, "execute", null);

  exports.default = BumpCommand;

  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  module.exports = require("clipanion");

  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {

  module.exports = require("@yarnpkg/cli");

  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  module.exports = require("@yarnpkg/core");

  /***/ }),
  /* 5 */
  /***/ (function(module, exports) {

  module.exports = require("@yarnpkg/plugin-essentials");

  /***/ })
  /******/ ]);
    return plugin;
  },
};
