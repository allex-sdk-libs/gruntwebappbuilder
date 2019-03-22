function createCSSStringAssetPreparator (lib, StringAssetPreparator) {
  'use strict';

  function CSSStringAssetPreparator (reader, assetstring) {
    StringAssetPreparator.call(this, reader, assetstring);
  }
  lib.inherit(CSSStringAssetPreparator, StringAssetPreparator);
  CSSStringAssetPreparator.prototype.searchGroup = 'css';
  CSSStringAssetPreparator.prototype.handleActualTarget = function (maybestep) {
    return maybestep;
  };
  CSSStringAssetPreparator.prototype.finalReturnProc = function (myret) {
    return [myret];
  };

  return CSSStringAssetPreparator;
}

module.exports = createCSSStringAssetPreparator;
