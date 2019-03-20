function createLib (lib) {
  'use strict';

  var Node = require('allex_nodehelpersserverruntimelib')(lib),
    ModuleRecognizerSync = require('allexmodulerecognitionsync');

  return {
    build: require('./build')(lib, Node, ModuleRecognizerSync),
    compile: require('./compile')(lib, Node, ModuleRecognizerSync)
  };
}

module.exports = createLib;
