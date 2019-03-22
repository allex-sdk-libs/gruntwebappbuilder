function createLib (lib) {
  'use strict';

  var Node = require('allex_nodehelpersserverruntimelib')(lib),
    ModuleRecognizerSync = require('allexmodulerecognitionsync'),
    util = require('./util')(lib, Node, ModuleRecognizerSync);

  return {
    build: require('./build')(lib, Node, util),
    compile: require('./compile')(lib, Node, util.recognizeModule)
  };
}

module.exports = createLib;
