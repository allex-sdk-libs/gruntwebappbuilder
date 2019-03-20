function createAssetHandling (lib, Node, globalutil) {
  'use strict';

  var Fs = Node.Fs,
    Path = Node.Path,
    StringAssetPreparator = require('./stringassetpreparatorcreator')(lib, Node);

  function Assets (reader) {
    this.reader = reader;
  }
  Assets.prototype.destroy = function () {
    this.reader = null;
  };

  Assets.prototype.processAsset = function (root_if_no_component, record) {
    if (!record) {
      console.log('cannot _processAsset, no record!');
      process.exit(0);
    }
    var ret = {
      component:null,
      src_path:null,
      dest_path:null,
      resolved: false
    },
      mydistro = this.reader.distro,
      mydevel = this.reader.devel,
      mycwd = this.reader.cwd,
      alternative = null,temp = null;

    if (!lib.isString(record)) {
      //basepath field: path
      //production field: minified path
      //devel field: devel path
      //conditional field: conditional tag
      //distro field : choices for different build distro

      if (!record.basepath) {
        record.basepath = './';
      }

      if (!record.production) record.production = record.devel;
      alternative = mydevel ? record.devel : record.production;

      if (record.distro) {
        if (mydistro in record.distro) {
          var rdd = record.distro[mydistro];
          if (lib.isString(rdd)){
            alternative = rdd;
          }else{
            if (!rdd.devel) {
              return this.reader.error('No devel distro asset in record: '+JSON.stringify(rdd));
            }
            if (!rdd.production) rdd.production = rdd.devel;

            alternative = mydevel ? rdd.devel : rdd.production;
          }
        }
      }
      if (!alternative) return this.reader.error('Record invalid:'+JSON.stringify(record, null, 2));
      ret.dest_path = Path.join(root_if_no_component, record.basepath, alternative);
      ret.src_path = mydevel ? Path.join(root_if_no_component, ret.dest_path) : globalutil.absolutizePath (mycwd, ret.dest_path);
      ret.conditional = record.conditional;
      //console.log('_prepareAsset string', ret);

      return this.handleAssetsFound([ret]);
    }else{
      return this.prepareStringAsset(root_if_no_component, record, ret);
    }
  }
  Assets.prototype.prepareStringAsset = function (root_if_no_component, assetstring) {
    /*
    var ap = new StringAssetPreparator(this.reader, assetstring, root_if_no_component),
      ret = ap.go();
    ap.destroy();
    return this.handleAssetsFound(ret);
    */
    return this.handleAssetsFound((new StringAssetPreparator(this.reader, assetstring, root_if_no_component)).go());
  };

  Assets.prototype.handleAssetsFound = function (assets) {
    assets.forEach(this.handleAssetFound.bind(this));
    return assets;
  };

  Assets.prototype.handleAssetFound = function (asset) {
    if (asset.component) {
      this.reader._requireComponent(asset.component);
    }
  };

  return Assets;
}

module.exports = createAssetHandling;
