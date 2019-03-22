function createJSStringAssetPreparator (lib, StringAssetPreparator, factory) {
  'use strict';

  function JSStringAssetPreparator (reader, assetstring) {
    StringAssetPreparator.call(this, reader, assetstring);
  }
  lib.inherit(JSStringAssetPreparator, StringAssetPreparator);
  JSStringAssetPreparator.prototype.searchGroup = 'js';
  JSStringAssetPreparator.prototype.handleActualTarget = function (maybestep) {
    this.assetpath = this.protoboard.actualtarget.slice();
    this.destpath = this.walkpath.slice(1).concat(this.assetpath);
    return this.assetpath.shift();
  };
  JSStringAssetPreparator.prototype.finalReturnProc = function (myret) {
    var ret = {js:[], css:[]};
    if (this.protoboard && this.protoboard.dependencies) {
      lib.traverseShallow(this.protoboard.dependencies, this.dependencyTraverser.bind(this, ret));
    };
    if (!(this.searchGroup in ret)) {
      ret[this.searchGroup] = [];
    }
    ret[this.searchGroup].push(myret);
    if (lib.isString(this.component) && this.component.indexOf('angular1datatable')>=0) {
      console.log(this);
      console.log(ret);
      process.exit(1);
    }
    return ret;
  };
  JSStringAssetPreparator.prototype.dependencyTraverser = function (ret, deps, group) {
    ret[group] = deps.reduce(this.digDependency.bind(this, group), []);
  };
  JSStringAssetPreparator.prototype.digDependency = function (group, result, dep) {
    Array.prototype.push.apply(result, (factory(this.reader, dep, group)).go());
    console.log(group, dep, '=>', result);
    return result;
  };

  return JSStringAssetPreparator;
}

module.exports = createJSStringAssetPreparator;
