function createAppBuilder (Lib, Node, globalutil) {
  'use strict';

  var Reader = require('./webappreadercreator')(Lib, Node, globalutil),
    Fs = Node.Fs,
    Path = Node.Path,
    Q = Lib.q,
    Allex = require('allex_allexjshelperssdklib')(Lib),
    AllexQ = Lib.qlib,
    ModuleQueue = require('./modulequeuecreator')(Lib, Node);

  function AppBuilder(devel, distro, path) {
    this.path =  path ? path : process.cwd();
    this.name = Path.basename(process.cwd());
    this.reader = null;
    this._installed = null;
    this.mq = null;
    this.devel = devel;
    this.distro = distro;
  }

  AppBuilder.prototype.destroy = function () {
    if (this.mq) this.mq.destroy();
    this.mq = null;
    this.devel = null;
    this._installed = null;
    if (this.reader) this.reader.destroy();
    this.reader = null;
    this.name = null;
    this.path = null;
    this.distro = null;
  };

  AppBuilder.prototype.info = function () {
    Array.prototype.unshift.call(arguments, this.name+':');
    Node.info.apply(null, arguments);
  };

  AppBuilder.prototype.install = function () {
    this.reader = new Reader(this.path, {
      devel: this.devel,
      distro : this.distro
    });
    this.reader.go();
    return this.onReadForInstall();
  };

  AppBuilder.prototype.onReadForInstall = function (reader) {
    var installed = Q.defer();
    this._installed = installed;
    this._prepare_components();

    return installed.promise;
  };



  AppBuilder.prototype._prepare_components = function () {
    this.mq = new ModuleQueue(this.reader);
    this.mq.install().done(this._app_ready.bind(this), this._installed.reject.bind(this._installed));
  };

  AppBuilder.prototype._app_ready = function () {
    this.info('Requirements satisfied, should go on ...');
    this.reader.finalize();
    this._installed.resolve();
  };

  return AppBuilder;

}

module.exports = createAppBuilder;

